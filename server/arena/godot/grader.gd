# Godot 4.4.1 headless. Executes exactly ONE call per isolated process.
# Never pass expected values or private fixture sets to this process.
extends SceneTree

const PREFIX := "GDH_VERDICT:"
const MAX_BYTES := 12000

func _initialize() -> void:
    _evaluate()

func _finish(result: Dictionary) -> void:
    print(PREFIX + JSON.stringify(result))
    quit(0)

func _fail(message: String) -> void:
    _finish({"status":"invalid","message":message.substr(0,100)})

func _evaluate() -> void:
    var argv := OS.get_cmdline_user_args()
    if argv.size() != 2:
        _fail("invalid_arguments")
        return
    var src_path := str(argv[0])
    var case_path := str(argv[1])
    if src_path != "/work/student.gd" or case_path != "/work/input.json":
        _fail("invalid_paths")
        return
    if not FileAccess.file_exists(src_path) or not FileAccess.file_exists(case_path):
        _fail("missing_input")
        return
    var source := FileAccess.get_file_as_string(src_path)
    if source.to_utf8_buffer().size() > MAX_BYTES or source.strip_edges().is_empty():
        _fail("invalid_source")
        return
    var arguments = JSON.parse_string(FileAccess.get_file_as_string(case_path))
    if not (arguments is Dictionary):
        _fail("invalid_case")
        return
    var method := str(arguments.get("method",""))
    var method_pattern := RegEx.new()
    method_pattern.compile("^[A-Za-z_][A-Za-z0-9_]{0,63}$")
    var params = arguments.get("args",[])
    if method_pattern.search(method) == null or not (params is Array) or params.size() > 5:
        _fail("invalid_method")
        return
    for param in params:
        if not (param == null or param is bool or param is int or param is float or param is String):
            _fail("invalid_parameter")
            return
    var extends_pattern := RegEx.new()
    extends_pattern.compile("(?m)^\\s*extends\\s+")
    if extends_pattern.search(source) == null:
        source = "extends Node\n" + source
    var script := GDScript.new()
    script.source_code = source
    var err := script.reload()
    if err != OK:
        _finish({"status":"compile_error","code":int(err)})
        return
    if not script.can_instantiate():
        _fail("not_instantiable")
        return
    var base := script.get_instance_base_type()
    if not (base == "Node" or ClassDB.is_parent_class(base,"Node")):
        _fail("not_node_script")
        return
    var instance := script.new() as Node
    if instance == null:
        _fail("invalid_instance")
        return
    # No add_child / _ready: competitive exercises are pure functions.
    if not instance.has_method(method):
        _finish({"status":"missing_method"})
        return
    var returned = instance.callv(method,params)
    if not (returned == null or returned is bool or returned is int or returned is float or returned is String):
        _finish({"status":"unsupported_return"})
        return
    _finish({"status":"executed","value":returned})
