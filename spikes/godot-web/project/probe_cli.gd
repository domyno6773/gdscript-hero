extends SceneTree

func _initialize() -> void:
    call_deferred("_run")

func _run() -> void:
    var source := "extends Node\nvar answer: int = 0\nfunc _ready():\n    answer = 100 / 3\n    print(\"GDH_PRINT:\", \"A\", \"B\")\n    print(\"GDH_DIV:\", 100 / 3)\n"
    var script := GDScript.new()
    script.source_code = source
    var error := script.reload()
    if error != OK:
        printerr("GDH_TEST_FAILED compile_error=", int(error))
        quit(1)
        return
    var instance := Node.new()
    instance.set_script(script)
    get_root().add_child(instance)
    if instance.get("answer") != 33:
        printerr("GDH_TEST_FAILED unexpected answer=", instance.get("answer"))
        quit(2)
        return
    print("GDH_PROPERTY:", instance.get("answer"))
    instance.queue_free()
    var invalid := GDScript.new()
    invalid.source_code = "extends Node\nfunc _ready():\n    var n: int = \"not_an_int\"\n"
    var bad_result := invalid.reload()
    if bad_result == OK:
        printerr("GDH_TEST_FAILED invalid script was accepted")
        quit(3)
        return
    print("GDH_COMPILE_ERROR_DETECTED:", int(bad_result))
    print("GDH_TEST_SUCCESS")
    quit(0)
