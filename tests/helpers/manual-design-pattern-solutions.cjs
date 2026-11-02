'use strict';
// Soluzioni di prova: non caricate dall'interfaccia né fornite allo studente.
module.exports={
216:{
 'score_manager.gd':[
 'class_name ScoreManager','extends RefCounted','static var instance: ScoreManager','var score = 0',
 'static func get_instance() -> ScoreManager:','    if instance == null:',
 '        instance = ScoreManager.new()','        print("Gestore punteggio creato")','    return instance',
 'func add_points(points: int) -> void:','    score += points'],
 'coin.gd':['class_name Coin','extends RefCounted','var value: int',
 'func _init(coin_value: int) -> void:','    value = coin_value',
 'func collect() -> void:','    ScoreManager.get_instance().add_points(value)']
},
217:{
 'enemy_factory.gd':['class_name EnemyFactory','extends RefCounted',
 'static func create(kind: String, level: int) -> Enemy:',
 '    match kind.to_lower():','        "goblin": return Goblin.new(level)',
 '        "orc": return Orc.new(level)','        _: return null'],
 'orc.gd':['class_name Orc','extends Enemy','func _init(level: int) -> void:','    super("Orc", 25 * level, 4 + level)']
},
218:{
 'weather_station.gd':['class_name WeatherStation','extends RefCounted',
 'signal temperature_changed(value: float)','var temperature = 0.0',
 'func attach(display: WeatherDisplay) -> void:',
 '    if not temperature_changed.is_connected(display.on_temperature_changed):',
 '        temperature_changed.connect(display.on_temperature_changed)',
 'func detach(display: WeatherDisplay) -> void:',
 '    if temperature_changed.is_connected(display.on_temperature_changed):',
 '        temperature_changed.disconnect(display.on_temperature_changed)',
 'func set_temperature(value: float) -> void:','    temperature = value','    temperature_changed.emit(value)'],
 'weather_display.gd':['class_name WeatherDisplay','extends RefCounted','var display_name: String',
 'func _init(n: String) -> void:','    display_name = n',
 'func on_temperature_changed(value: float) -> void:','    print("%s: %.1f C" % [display_name, value])']
},
219:{
 'cart.gd':['class_name Cart','extends RefCounted','var prices: Array[int] = []',
 'var discount: Discount = Discount.new()','func add_item(price: int) -> void:','    prices.append(price)',
 'func set_discount(new_discount: Discount) -> void:','    discount = new_discount',
 'func checkout() -> String:','    var total = 0','    for price in prices:','        total += price',
 '    return "Subtotale %d, %s, da pagare %d" % [total, discount.label(), discount.apply(total)]'],
 'percent_off.gd':['class_name PercentOff','extends Discount','var percent: int',
 'func _init(p: int) -> void:','    percent = p','func apply(total: int) -> int:',
 '    return total - total * percent / 100','func label() -> String:','    return "sconto %d%%" % percent'],
 'fixed_off.gd':['class_name FixedOff','extends Discount','var amount: int','func _init(a: int) -> void:',
 '    amount = a','func apply(total: int) -> int:','    return maxi(0, total - amount)',
 'func label() -> String:','    return "sconto %d" % amount']
},
220:{
 'move_command.gd':['class_name MoveCommand','extends Command','var hero: Hero','var dx: int','var dy: int',
 'func _init(target: Hero, step_x: int, step_y: int) -> void:',
 '    hero = target','    dx = step_x','    dy = step_y','func execute() -> void:',
 '    hero.x += dx','    hero.y += dy','func undo() -> void:','    hero.x -= dx','    hero.y -= dy'],
 'command_history.gd':['class_name CommandHistory','extends RefCounted','var done: Array[Command] = []',
 'func run(command: Command) -> void:','    command.execute()','    done.append(command)',
 'func undo_last() -> bool:','    if done.is_empty():','        return false',
 '    var command: Command = done.pop_back()','    command.undo()','    return true']
}
};
