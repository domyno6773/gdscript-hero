extends SceneTree
func _initialize() -> void:
    call_deferred("run_cases")
func run_cases() -> void:
    var args = OS.get_cmdline_user_args()
    var cases = JSON.parse_string(FileAccess.get_file_as_string(args[0]))
    var runner = load("res://runner.gd").new()
    root.add_child(runner)
    for item in cases:
        print("__GDH_BEGIN__", item.key)
        var options: Dictionary = item.options
        Engine.set_meta("__manual_input",options.get("stdin",[]).duplicate())
        var reply: Dictionary
        if options.get("project") is Dictionary:
            reply = runner.run_project(options.project.files,options.project.get("entry","main.gd"),options.get("calls",[]))
        else:
            reply = runner.run_candidate(item.code,[],[],options.get("calls",[]))
        print("__GDH_REPLY__", JSON.stringify(reply))
        await process_frame
    quit(0)
