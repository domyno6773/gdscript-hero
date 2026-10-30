extends SceneTree

func _initialize() -> void:
    call_deferred("run_cases")

func run_cases() -> void:
    var args := OS.get_cmdline_user_args()
    if args.is_empty():
        quit(2)
        return
    var cases = JSON.parse_string(FileAccess.get_file_as_string(args[0]))
    var runner = load("res://native/project/runner.gd").new()
    root.add_child(runner)
    for item in cases:
        print("__GDH_BEGIN__", item.key)
        var options: Dictionary = item.options
        var reply = runner.run_candidate(item.code, options.get("inspect", []), options.get("locals", []), options.get("calls", []), options.get("emissions", []), options.get("objectCalls", []), options.get("scene", 0), options.get("actions", []))
        print("__GDH_REPLY__", JSON.stringify(reply))
        await process_frame
    quit(0)
