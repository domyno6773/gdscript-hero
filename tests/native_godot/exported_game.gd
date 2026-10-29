extends SceneTree
func _initialize() -> void:
    PhysicsServer2D.set_active(true)
    call_deferred("test")
func test() -> void:
    var scene = load("res://main.tscn").instantiate()
    root.add_child(scene)
    assert(scene.get_node("Player/PlayerShape").shape.size == Vector2(20,20))
    assert(scene.get_node("Coin/CoinShape").shape.size == Vector2(24,24))
    Input.action_press("ui_right")
    await create_timer(1.2).timeout
    Input.action_release("ui_right")
    if scene.punti != 1 or scene.has_node("Coin") or scene.get_node("StatoLabel").text != "Hai vinto!":
        push_error("Export does not reproduce the collectible game")
        quit(1)
        return
    print("EXPORTED_GAME: PASS")
    quit(0)
