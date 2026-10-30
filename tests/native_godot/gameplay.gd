extends SceneTree

func _initialize() -> void:
    # --script SceneTree does not activate the physics server automatically.
    PhysicsServer2D.set_active(true)
    # Several physics ticks per render frame must not extend an observation.
    Engine.max_fps = 15
    call_deferred("run_cases")

func run_cases() -> void:
    var cases = JSON.parse_string(FileAccess.get_file_as_string(OS.get_cmdline_user_args()[0]))
    var runner = load("res://native/project/runner.gd").new()
    root.add_child(runner)
    for item in cases:
        print("__GDH_BEGIN__", item.key)
        var options: Dictionary = item.options
        var reply: Dictionary
        if options.mode == "sandbox_start":
            reply = runner.run_candidate(item.code, options.get("inspect", []), [], [], [], [], 0, [], options.nodes, true)
            if is_instance_valid(runner._sandbox_instance):
                runner._sandbox_instance.process_mode = Node.PROCESS_MODE_DISABLED
        else:
            reply = await runner.observe_sandbox(options.frames, options.input)
        print("__GDH_REPLY__", JSON.stringify(reply))
    quit(0)
