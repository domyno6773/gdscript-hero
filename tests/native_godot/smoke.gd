extends SceneTree

func _initialize() -> void:
    call_deferred("_run")

func _run() -> void:
    var root_node := Node.new()
    root_node.name = "TestRoot"
    root.add_child(root_node)

    var moneta := Node.new()
    moneta.name = "Moneta"
    root_node.add_child(moneta)

    var initially_present := root_node.has_node("Moneta")
    moneta.queue_free()
    var immediately_present := root_node.has_node("Moneta")
    var queued := moneta.is_queued_for_deletion()

    print("NATIVE_INITIAL: ", initially_present)
    print("NATIVE_IMMEDIATE_PRESENT: ", immediately_present)
    print("NATIVE_QUEUED: ", queued)
    print("NATIVE_VECTOR2: ", Vector2(100, 200))

    if not initially_present or not immediately_present or not queued:
        push_error("queue_free non ha il comportamento previsto")
        quit(1)
        return

    await process_frame
    var present_after_frame := root_node.has_node("Moneta")
    print("NATIVE_AFTER_FRAME_PRESENT: ", present_after_frame)
    if present_after_frame:
        push_error("Moneta non eliminata dopo il frame")
        quit(1)
    else:
        quit(0)
