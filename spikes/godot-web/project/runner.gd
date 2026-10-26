# Prototipo esclusivamente locale e non sicuro: NO codice GDScript non fidato.
extends Node

var _receive_callback: JavaScriptObject
var _captured_locals: Dictionary = {}

func __gdh_normalize(value: Variant) -> Variant:
    if value is Vector2:
        return {"__type": "Vector2", "x": value.x, "y": value.y}
    return value

func __gdh_record(values: Dictionary) -> void:
    _captured_locals = {}
    for key in values.keys():
        _captured_locals[key] = __gdh_normalize(values[key])

func _ready() -> void:
    if not OS.has_feature("web"):
        print("GDH_SPIKE_READY_NATIVE")
        return
    _receive_callback = JavaScriptBridge.create_callback(_on_js_request)
    var browser := JavaScriptBridge.get_interface("window")
    browser.gdhReceive = _receive_callback
    JavaScriptBridge.eval("window.gdhReady?.()")

func _on_js_request(args: Array) -> void:
    if args.is_empty():
        return
    var request = JSON.parse_string(str(args[0]))
    if not (request is Dictionary):
        return
    var reply := run_candidate(str(request.get("code", "")), request.get("inspect", []), request.get("locals", []), request.get("calls", []))
    reply["id"] = request.get("id", null)
    var browser := JavaScriptBridge.get_interface("window")
    browser.gdhResult(JSON.stringify(reply))

# Osservazione didattica limitata alle variabili locali di _ready().
# NON altera il testo salvato e NON è un parser generale.
func _with_local_capture(source: String, names: Array) -> String:
    if names.is_empty():
        return ""
    var identifier := RegEx.new()
    identifier.compile("^[A-Za-z_][A-Za-z0-9_]*$")
    var ready_header := RegEx.new()
    ready_header.compile("^([ \t]*)func[ \t]+_ready[ \t]*\\([ \t]*\\)[ \t]*(?:->[ \t]*void[ \t]*)?:")
    var lines: Array = []
    for part in source.split("\n"):
        lines.append(str(part))
    var header_index := -1
    var header_indent := ""
    for i in range(lines.size()):
        var match_found = ready_header.search(lines[i])
        if match_found != null:
            header_index = i
            header_indent = match_found.get_string(1)
            break
    if header_index == -1:
        return ""
    var pairs := PackedStringArray()
    for name_value in names:
        var name := str(name_value)
        if identifier.search(name) == null:
            return ""
        pairs.append('"' + name + '": ' + name)
    var indentation := header_indent + "    "
    var insertion := lines.size()
    for i in range(header_index + 1, lines.size()):
        var entry := str(lines[i])
        var clean := entry.strip_edges()
        if clean.is_empty() or clean.begins_with("#"):
            continue
        var leading := entry.length() - entry.strip_edges(true, false).length()
        if leading <= header_indent.length():
            insertion = i
            break
    lines.insert(insertion, indentation + "get_parent().call(\"__gdh_record\", {" + ", ".join(pairs) + "})")
    return "\n".join(lines)

func run_candidate(source: String, inspect: Variant = [], capture_names: Variant = [], method_calls: Variant = []) -> Dictionary:
    if source.length() > 10000:
        return {"status": "rejected", "message": "Superati 10000 caratteri"}
    var extends_regex := RegEx.new()
    extends_regex.compile("(?m)^\\s*extends\\s+")
    if extends_regex.search(source) == null:
        source = "extends Node\n" + source
    var candidate := GDScript.new()
    candidate.source_code = source
    var err := candidate.reload()
    if err != OK:
        return {"status": "compile_error", "code": int(err)}
    if not candidate.can_instantiate() or candidate.get_instance_base_type() != "Node":
        return {"status": "unsupported", "message": "Solo script Node in questo spike"}
    var local_state := "not_requested"
    _captured_locals = {}
    if capture_names is Array and not capture_names.is_empty():
        if capture_names.size() <= 20:
            var instrumented_source := _with_local_capture(source, capture_names)
            if not instrumented_source.is_empty():
                var instrumented_script := GDScript.new()
                instrumented_script.source_code = instrumented_source
                if instrumented_script.reload() == OK and instrumented_script.can_instantiate() and instrumented_script.get_instance_base_type() == "Node":
                    candidate = instrumented_script
                    local_state = "instrumented"
                else:
                    local_state = "unavailable"
            else:
                local_state = "unavailable"
        else:
            local_state = "unavailable"
    var instance := Node.new()
    instance.set_script(candidate)
    add_child(instance)
    var observed := {}
    if inspect is Array:
        var declared := {}
        for prop in instance.get_property_list():
            if int(prop.get("usage", 0)) & PROPERTY_USAGE_SCRIPT_VARIABLE:
                declared[str(prop.get("name"))] = true
        for entry in inspect.slice(0, 20):
            var name := str(entry)
            if declared.has(name):
                var value = instance.get(name)
                if value is int or value is float or value is bool or value is String or value == null:
                    observed[name] = value
                else:
                    observed[name] = str(value)
    var method_results: Array = []
    if method_calls is Array:
        var identifier := RegEx.new()
        identifier.compile("^[A-Za-z_][A-Za-z0-9_]*$")
        for request_call in method_calls.slice(0, 8):
            if not (request_call is Dictionary):
                continue
            var name := str(request_call.get("method", ""))
            var args = request_call.get("args", [])
            if identifier.search(name) == null or not (args is Array) or args.size() > 5:
                method_results.append({"method": name, "status": "invalid"})
                continue
            if not instance.has_method(name):
                method_results.append({"method": name, "status": "missing"})
                continue
            var valid_args := true
            for arg in args:
                if not (arg is int or arg is float or arg is bool or arg is String or arg == null):
                    valid_args = false
            if not valid_args:
                method_results.append({"method": name, "status": "invalid"})
                continue
            var output = instance.callv(name, args)
            method_results.append({"method": name, "args": args, "status": "executed", "value": __gdh_normalize(output)})
    instance.queue_free()
    return {"status": "executed", "properties": observed, "locals": _captured_locals.duplicate(true), "localCapture": local_state, "methodCalls": method_results}
