extends SceneTree

var failures := 0

func check(condition: bool, message: String) -> void:
    if not condition:
        failures += 1
        push_error(message)

func _initialize() -> void:
    # --script SceneTree does not activate the physics server automatically.
    PhysicsServer2D.set_active(true)
    call_deferred("test")

func test() -> void:
    var runner = load("res://native/project/runner.gd").new()
    root.add_child(runner)
    var specs = [
        {"name":"Main", "type":"Node2D", "parent":null},
        {"name":"HUD", "type":"Control", "parent":"Main", "position":{"x":10,"y":20}},
        {"name":"Caption", "type":"Label", "parent":"HUD", "text":"Editor"},
        {"name":"Buy", "type":"Button", "parent":"HUD", "text":"Compra"},
        {"name":"Clock", "type":"Timer", "parent":"Main", "wait_time":0.05,"one_shot":true,"autostart":true}
    ]
    var code = 'extends Node2D\nvar ticks = 0\nfunc _ready():\n    $HUD/Caption.text = "Runtime"\n    $HUD/Buy.pressed.connect(buy)\n    $Clock.timeout.connect(tick)\nfunc buy():\n    $HUD/Caption.text = "Acquistato"\nfunc tick():\n    ticks += 1\n'
    var result = runner.run_candidate(code, [], [], [], [], [], 0, [], specs, true)
    check(result.status == "executed", "Scene must execute")
    check(runner._sandbox_instance is Node2D, "Root type must match authored scene")
    check(runner._sandbox_instance.get_node("HUD").position == Vector2(10,20), "Inspector transform must reach Godot")
    check(runner._sandbox_instance.get_node("HUD/Caption").text == "Runtime", "Nested node access")
    runner._sandbox_action("Buy", "pressed")
    check(runner._sandbox_instance.get_node("HUD/Caption").text == "Acquistato", "Persistent explicit signal connection")
    await create_timer(0.15).timeout
    check(runner._sandbox_instance.ticks == 1, "Timer must fire in actual elapsed time, once")
    var silent = 'extends Node2D\nvar clicks = 0\nfunc _on_buy_pressed():\n    clicks += 1\n'
    runner.run_candidate(silent, [], [], [], [], [], 0, [], specs, true)
    runner._sandbox_action("Buy", "pressed")
    check(runner._sandbox_instance.clicks == 0, "Callback name alone must not create a connection")
    var body_specs = [
        {"name":"Player","type":"CharacterBody2D","parent":null,"position":{"x":40,"y":60}},
        {"name":"Shape","type":"CollisionShape2D","parent":"Player","shape_size":{"x":20,"y":20}},
        {"name":"Wall","type":"StaticBody2D","parent":"Player","position":{"x":100,"y":0}}
    ]
    # The obstacle belongs to a separate fixed world, not to the moving body.
    body_specs.remove_at(2)
    var movement = 'extends CharacterBody2D\nfunc _physics_process(_delta):\n    velocity = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") * 100.0\n    move_and_slide()\n'
    runner.run_candidate(movement, [], [], [], [], [], 0, [], body_specs, true)
    var player = runner._sandbox_instance
    check(player.get_node("Shape").shape.size == Vector2(20,20), "Collision shape properties")
    var wall = StaticBody2D.new()
    var shape = CollisionShape2D.new()
    shape.shape = RectangleShape2D.new()
    shape.shape.size = Vector2(20,100)
    wall.position = Vector2(100,60)
    wall.add_child(shape)
    root.add_child(wall)
    Input.action_press("ui_right")
    await create_timer(0.8).timeout
    Input.action_release("ui_right")
    check(player.position.x > 50 and player.position.x < 82, "Native input and collision must stop movement at wall")
    wall.queue_free()
    var invalid = runner.run_candidate('extends CharacterBody2D\n', [], [], [], [], [], 0, [], specs, true)
    check(invalid.status == "invalid_scene", "Incompatible root/script must be rejected")
    print("LABORATORY_NATIVE: ", "PASS" if failures == 0 else str(failures) + " failures")
    quit(failures)
