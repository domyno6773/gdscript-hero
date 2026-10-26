# Prototipo esclusivamente locale e non sicuro: NO codice GDScript non fidato.
extends Node

var _receive_callback: JavaScriptObject
var _captured_locals: Dictionary = {}
var _captured_objects: Dictionary = {}

func __gdh_normalize(value: Variant, depth: int = 0) -> Variant:
    if value is Vector2:
        return {"__type": "Vector2", "x": value.x, "y": value.y}
    if value == null or value is bool or value is int or value is float or value is String:
        return value
    if depth >= 3:
        return {"__type": "truncated"}
    if value is Array:
        var items: Array = []
        for item in value.slice(0, 24):
            items.append(__gdh_normalize(item, depth + 1))
        return items
    if value is Dictionary:
        var entries: Dictionary = {}
        var keys = value.keys()
        for key in keys.slice(0, 24):
            entries[str(key)] = __gdh_normalize(value[key], depth + 1)
        return entries
    if value is Object:
        var fields: Dictionary = {}
        if value.get_script() == null:
            return {"__type": "Object"}
        for property in value.get_property_list():
            if int(property.get("usage", 0)) & PROPERTY_USAGE_SCRIPT_VARIABLE:
                if fields.size() >= 16:
                    break
                var name := str(property.get("name", ""))
                if not name.is_empty():
                    fields[name] = __gdh_normalize(value.get(name), depth + 1)
        return {"__type": "Object", "fields": fields}
    return {"__type": "unsupported"}

func __gdh_record(values: Dictionary) -> void:
    _captured_locals = {}
    _captured_objects = {}
    for key in values.keys():
        _captured_objects[key] = values[key]
        _captured_locals[key] = __gdh_normalize(values[key])

func _ready() -> void:
    if not OS.has_feature("web"):
        print("GDH_SPIKE_READY_NATIVE")
        return
    _receive_callback = JavaScriptBridge.create_callback(_on_js_request)
    var browser := JavaScriptBridge.get_interface("window")
    browser.gdhReceive = _receive_callback
    JavaScriptBridge.eval("window.gdhReady?.()")

# Separate compiler messages caused by the original script from messages caused by
# our optional local-variable instrumentation. User GDScript never gets a trusted grade.
func __gdh_phase(phase: String) -> void:
    if OS.has_feature("web"):
        JavaScriptBridge.eval("window.gdhPhase?.(" + JSON.stringify(phase) + ")")

func _on_js_request(args: Array) -> void:
    if args.is_empty():
        return
    var request = JSON.parse_string(str(args[0]))
    if not (request is Dictionary):
        return
    var reply := run_candidate(str(request.get("code", "")), request.get("inspect", []), request.get("locals", []), request.get("calls", []), request.get("emissions", []), request.get("objectCalls", []), request.get("scene", null), request.get("actions", []))
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

# Scene native minime per le lezioni 49-60 (non simulazioni di Label, Button o Timer).
func _scene_spec(lesson_id: int) -> Dictionary:
    match lesson_id:
        49: return {"Giocatore": "Node"}
        50: return {"Titolo": "Label"}
        51: return {"SaluteLabel": "Label"}
        52: return {"TitoloDungeon": "Label", "LivelloLabel": "Label", "MoneteLabel": "Label"}
        53, 54: return {"AttaccaBtn": "Button"}
        55: return {"ClickBtn": "Button", "PuntiLabel": "Label"}
        56: return {"MotoriBtn": "Button", "AllarmeBtn": "Button", "StatoNave": "Label"}
        57: return {"Cooldown": "Timer"}
        58: return {"BarraVita": "ColorRect"}
        59: return {"Moneta": "Node"}
        60: return {"CompraPozioneBtn": "Button", "OroLabel": "Label", "MessaggioLabel": "Label"}
        _: return {}

func _build_scene(instance: Node, lesson_id: int) -> void:
    for key in _scene_spec(lesson_id).keys():
        var type_name := str(_scene_spec(lesson_id)[key])
        var child: Node
        match type_name:
            "Label": child = Label.new()
            "Button": child = Button.new()
            "Timer": child = Timer.new()
            "ColorRect": child = ColorRect.new()
            _: child = Node.new()
        child.name = str(key)
        instance.add_child(child)

func _scene_snapshot(instance: Node, lesson_id: int) -> Dictionary:
    var result: Dictionary = {}
    for name in _scene_spec(lesson_id).keys():
        var node := instance.get_node_or_null(NodePath(str(name)))
        if node == null:
            result[str(name)] = {"exists": false}
            continue
        var state: Dictionary = {"exists": true, "class": node.get_class(), "queued": node.is_queued_for_deletion()}
        if node is Label or node is Button:
            state["text"] = node.text
        if node is Button:
            state["pressed_connections"] = node.get_signal_connection_list("pressed").size()
        if node is Timer:
            state["wait_time"] = node.wait_time
            state["one_shot"] = node.one_shot
            state["stopped"] = node.is_stopped()
            state["timeout_connections"] = node.get_signal_connection_list("timeout").size()
        if node is ColorRect:
            state["color"] = node.color.to_html(false)
            state["size"] = {"x": node.size.x, "y": node.size.y}
        result[str(name)] = state
    return result

func run_candidate(source: String, inspect: Variant = [], capture_names: Variant = [], method_calls: Variant = [], signal_emissions: Variant = [], object_calls: Variant = [], scene_lesson: Variant = null, scene_actions: Variant = []) -> Dictionary:
    if source.length() > 10000:
        return {"status": "rejected", "message": "Superati 10000 caratteri"}
    var extends_regex := RegEx.new()
    extends_regex.compile("(?m)^\\s*extends\\s+")
    if extends_regex.search(source) == null:
        source = "extends Node\n" + source
    # The ORIGINAL source is compiled first, without any modified student code.
    __gdh_phase("original_compile")
    var candidate := GDScript.new()
    candidate.source_code = source
    var err := candidate.reload()
    if err != OK:
        return {"status": "compile_error", "code": int(err)}
    if not candidate.can_instantiate() or candidate.get_instance_base_type() != "Node":
        return {"status": "unsupported", "message": "Solo script Node in questo spike"}
    var local_state := "not_requested"
    var local_reason := ""
    _captured_locals = {}
    _captured_objects = {}
    if capture_names is Array and not capture_names.is_empty():
        if capture_names.size() <= 20:
            var instrumented_source := _with_local_capture(source, capture_names)
            if not instrumented_source.is_empty():
                __gdh_phase("instrumentation")
                var instrumented_script := GDScript.new()
                instrumented_script.source_code = instrumented_source
                if instrumented_script.reload() == OK and instrumented_script.can_instantiate() and instrumented_script.get_instance_base_type() == "Node":
                    candidate = instrumented_script
                    local_state = "instrumented"
                else:
                    # Do not confuse our failed instrumentation with the student's code.
                    local_state = "unavailable"
                    local_reason = "instrumentation_compile_error"
            else:
                local_state = "unavailable"
                local_reason = "transform_unavailable"
        else:
            local_state = "unavailable"
            local_reason = "capture_limit_exceeded"
    # Only diagnostics emitted during ORIGINAL compilation or execution belong to
    # the student's error stream. Diagnostics from instrumentation stay separate.
    __gdh_phase("execution")
    var instance := Node.new()
    instance.set_script(candidate)
    var active_scene := 0
    if scene_lesson is int or scene_lesson is float:
        active_scene = int(scene_lesson)
    _build_scene(instance, active_scene)
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
    var signal_results: Array = []
    if signal_emissions is Array:
        var valid_name := RegEx.new()
        valid_name.compile("^[A-Za-z_][A-Za-z0-9_]*$")
        for request_emit in signal_emissions.slice(0, 6):
            if not (request_emit is Dictionary):
                continue
            var name := str(request_emit.get("signal", ""))
            var args = request_emit.get("args", [])
            if valid_name.search(name) == null or not (args is Array) or args.size() > 5:
                signal_results.append({"signal": name, "status": "invalid"})
                continue
            if not instance.has_signal(name):
                signal_results.append({"signal": name, "status": "missing"})
                continue
            var connections = instance.get_signal_connection_list(name).size()
            var emit_args := [name]
            emit_args.append_array(args)
            instance.callv("emit_signal", emit_args)
            signal_results.append({"signal": name, "status": "emitted", "connections": connections})
    var object_results: Array = []
    if object_calls is Array:
        var identifier := RegEx.new()
        identifier.compile("^[A-Za-z_][A-Za-z0-9_]*$")
        for request_object in object_calls.slice(0, 8):
            if not (request_object is Dictionary):
                continue
            var variable := str(request_object.get("variable", ""))
            var method := str(request_object.get("method", ""))
            var args = request_object.get("args", [])
            var updates = request_object.get("set", {})
            if identifier.search(variable) == null or identifier.search(method) == null:
                object_results.append({"variable": variable, "status": "invalid"})
                continue
            if not _captured_objects.has(variable):
                object_results.append({"variable": variable, "status": "missing"})
                continue
            var object = _captured_objects[variable]
            if not (object is Object) or not object.has_method(method):
                object_results.append({"variable": variable, "status": "missing_method"})
                continue
            if not (args is Array) or args.size() > 5 or not (updates is Dictionary):
                object_results.append({"variable": variable, "status": "invalid"})
                continue
            var allowed: Dictionary = {}
            for property in object.get_property_list():
                if int(property.get("usage", 0)) & PROPERTY_USAGE_SCRIPT_VARIABLE:
                    allowed[str(property.get("name", ""))] = true
            for key in updates.keys():
                if allowed.has(str(key)):
                    object.set(str(key), updates[key])
            var output = object.callv(method, args)
            object_results.append({"variable": variable, "method": method, "status": "executed", "value": __gdh_normalize(output)})
    var initial_scene := _scene_snapshot(instance, active_scene)
    var action_results: Array = []
    if scene_actions is Array:
        for entry in scene_actions.slice(0, 7):
            if not (entry is Dictionary):
                continue
            var child_name := str(entry.get("node", ""))
            var signal_name := str(entry.get("signal", ""))
            if not _scene_spec(active_scene).has(child_name):
                action_results.append({"status": "invalid"})
                continue
            if signal_name != "pressed" and signal_name != "timeout":
                action_results.append({"status": "invalid"})
                continue
            var selected := instance.get_node_or_null(NodePath(child_name))
            if selected == null or not selected.has_signal(signal_name):
                action_results.append({"status": "missing"})
                continue
            var connections := selected.get_signal_connection_list(signal_name).size()
            selected.emit_signal(signal_name)
            action_results.append({
                "status": "emitted", "node": child_name, "signal": signal_name,
                "connections": connections, "scene": _scene_snapshot(instance, active_scene)
            })
    # Properties of the root instance must be read AFTER button callbacks, for example punti/monete.
    if inspect is Array:
        for entry in inspect.slice(0, 20):
            var name := str(entry)
            if instance.get_script() != null:
                for prop in instance.get_property_list():
                    if str(prop.get("name", "")) == name and int(prop.get("usage", 0)) & PROPERTY_USAGE_SCRIPT_VARIABLE:
                        observed[name] = __gdh_normalize(instance.get(name))
                        break
    var final_scene := _scene_snapshot(instance, active_scene)
    instance.queue_free()
    return {"status": "executed", "properties": observed, "locals": _captured_locals.duplicate(true), "localCapture": local_state, "localCaptureReason": local_reason, "methodCalls": method_results, "signalEmissions": signal_results, "objectCalls": object_results, "scene": final_scene, "sceneBeforeActions": initial_scene, "sceneActions": action_results}
