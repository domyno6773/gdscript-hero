# Prototipo esclusivamente locale e non sicuro: NO codice GDScript non fidato.
extends Node

var _receive_callback: JavaScriptObject

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
    var reply := run_candidate(str(request.get("code", "")), request.get("inspect", []))
    reply["id"] = request.get("id", null)
    var browser := JavaScriptBridge.get_interface("window")
    browser.gdhResult(JSON.stringify(reply))

func run_candidate(source: String, inspect: Variant = []) -> Dictionary:
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
    instance.queue_free()
    return {"status": "executed", "properties": observed}
