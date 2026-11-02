'use strict';
// Soluzioni indipendenti usate da Godot nativo e dalla prova browser.
const lines=s=>s.trim().split('\n');
const solutions={
221:{'thermometer_adapter.gd':lines(`class_name ThermometerAdapter
extends RefCounted
var thermometer: LegacyThermometer
func _init(wrapped: LegacyThermometer) -> void:
    thermometer = wrapped
func get_sensor_name() -> String:
    return "Termometro " + thermometer.get_code()
func get_celsius() -> float:
    return (thermometer.read_fahrenheit() - 32.0) * 5.0 / 9.0`)},
222:Object.fromEntries(['Milk','Mocha','Large'].map((name,i)=>[name.toLowerCase()+'.gd',lines(`class_name ${name}
extends Beverage
var inner: Beverage
func _init(drink: Beverage) -> void:
    inner = drink
func cost() -> int:
    return ${i===2?'inner.cost() * 2':'inner.cost() + '+(i+1)}
func description() -> String:
    return ${i===2?'"Large " + inner.description()':'inner.description() + " + '+name+'"'}`)])),
223:{'exporter.gd':lines(`@abstract
class_name Exporter
extends RefCounted
func export_rows(rows: Array) -> void:
    var heading = header()
    if heading != "": print(heading)
    for row in rows: print(format_row(row))
    var ending = footer(rows)
    if ending != "": print(ending)
func header() -> String:
    return ""
@abstract func format_row(row: Dictionary) -> String
func footer(_rows: Array) -> String:
    return ""`),
'csv_exporter.gd':lines(`class_name CsvExporter
extends Exporter
func header() -> String:
    return "nome,punteggio"
func format_row(row: Dictionary) -> String:
    return "%s,%d" % [row["name"], row["score"]]`),
'list_exporter.gd':lines(`class_name ListExporter
extends Exporter
func format_row(row: Dictionary) -> String:
    return "* %s ha segnato %d" % [row["name"], row["score"]]
func footer(rows: Array) -> String:
    return "Giocatori: %d" % rows.size()`)},
224:{'door.gd':lines(`class_name Door
extends RefCounted
var state: DoorState = LockedState.new()
func handle_action(action: String) -> void:
    var next = state.handle(action)
    if next == state:
        print(action, ": ancora ", state.get_state_name())
    else:
        print(action, ": ", state.get_state_name(), " -> ", next.get_state_name())
        state = next`),
'closed_state.gd':lines(`class_name ClosedState
extends DoorState
func get_state_name() -> String:
    return "Chiuso"
func handle(action: String) -> DoorState:
    if action == "apri": return OpenState.new()
    if action == "blocca": return LockedState.new()
    return self`),
'open_state.gd':lines(`class_name OpenState
extends DoorState
func get_state_name() -> String:
    return "Aperto"
func handle(action: String) -> DoorState:
    if action == "chiudi": return ClosedState.new()
    return self`)},
225:{'file_entry.gd':lines(`class_name FileEntry
extends DiskEntry
var size: int
func _init(n: String, s: int) -> void:
    entry_name = n
    size = s
func get_size() -> int:
    return size
func count_files() -> int:
    return 1
func list_lines(indent: String) -> void:
    print("%s%s (%d KB)" % [indent, entry_name, size])`),
'folder_entry.gd':lines(`class_name FolderEntry
extends DiskEntry
var children: Array[DiskEntry] = []
func _init(n: String) -> void:
    entry_name = n
func add(entry: DiskEntry) -> void:
    children.append(entry)
func get_size() -> int:
    var result = 0
    for entry in children: result += entry.get_size()
    return result
func count_files() -> int:
    var result = 0
    for entry in children: result += entry.count_files()
    return result
func list_lines(indent: String) -> void:
    print("%s%s/ (%d KB)" % [indent, entry_name, get_size()])
    for entry in children: entry.list_lines(indent + "  ")`)}
};
const book=lines(`class_name Book
extends RefCounted
var title: String
var author: String
var isbn: String
var available = true
var borrower_id = ""
func _init(title: String, author: String, isbn: String) -> void:
    self.title = title
    self.author = author
    self.isbn = isbn
func _to_string() -> String:
    var status = "Disponibile" if available else "Non disponibile"
    return "%s di %s (ISBN: %s) - %s" % [title, author, isbn, status]`);
const user=lines(`class_name User
extends RefCounted
var user_id: String
var user_name: String
var borrowed_isbns: Array[String] = []
func _init(user_id: String, user_name: String) -> void:
    self.user_id = user_id
    self.user_name = user_name
func _to_string() -> String:
    return "Utente: %s (ID: %s) - Libri in prestito: %d" % [user_name, user_id, borrowed_isbns.size()]`);
const libBase=typed=>lines(`class_name Library
extends RefCounted
var library_name: String
var books: Array[${typed?'Book':'String'}] = []
var users: Array[${typed?'User':'String'}] = []
func _init(library_name: String) -> void:
    self.library_name = library_name
func _to_string() -> String:
    return "Biblioteca %s (libri: %d, utenti: %d)" % [library_name, books.size(), users.size()]`);
const libAdd=lines(`func add_book(book: Book) -> void:
    books.append(book)
func add_user(user: User) -> void:
    users.append(user)`);
const libBorrow=lines(`func find_book(isbn: String) -> Book:
    for b in books:
        if b.isbn == isbn: return b
    return null
func find_user(user_id: String) -> User:
    for u in users:
        if u.user_id == user_id: return u
    return null
func borrow_book(isbn: String, user_id: String) -> String:
    var b = find_book(isbn)
    if b == null: return "Libro non trovato"
    var u = find_user(user_id)
    if u == null: return "Utente non trovato"
    if not b.available: return "Il libro non è disponibile"
    b.available = false
    b.borrower_id = user_id
    u.borrowed_isbns.append(isbn)
    return "Libro prestato correttamente"`);
const libSearch=lines(`func search_by_title(text: String) -> Array[Book]:
    var matches: Array[Book] = []
    for b in books:
        if text.is_empty() or b.title.to_lower().contains(text.to_lower()): matches.append(b)
    return matches`);
const libStats=lines(`func get_statistics() -> Dictionary:
    var available_count = 0
    var active_users = 0
    for b in books:
        if b.available: available_count += 1
    for u in users:
        if u.borrowed_isbns.size() > 0: active_users += 1
    return {"total_books": books.size(), "available_books": available_count, "borrowed_books": books.size()-available_count, "total_users": users.size(), "users_with_books": active_users}`);
const libReturn=lines(`func return_book(isbn: String, user_id: String) -> String:
    var b = find_book(isbn)
    if b == null: return "Libro non trovato"
    var u = find_user(user_id)
    if u == null: return "Utente non trovato"
    if b.available or b.borrower_id != user_id: return "Questo libro non è stato preso in prestito da questo utente"
    b.available = true
    b.borrower_id = ""
    u.borrowed_isbns.erase(isbn)
    return "Libro restituito correttamente"`);
const returnAll=lines(`func return_all_books(library: Library) -> int:
    var returned = 0
    for isbn in borrowed_isbns.duplicate():
        if library.return_book(isbn, user_id) == "Libro restituito correttamente": returned += 1
    return returned`);
solutions[226]={'library.gd':libBase(false)};
solutions[227]={'book.gd':book,'user.gd':user,'library.gd':[...libBase(true),...libAdd]};
for(let n=228;n<=231;n++)solutions[n]={
 'library.gd':[...libBase(true),...libAdd,...libBorrow,...(n>=229?libSearch:[]),...(n>=230?libStats:[]),...(n===231?libReturn:[])],
 ...(n===231?{'user.gd':[...user,...returnAll]}:{})
};
solutions[232]={
'person.gd':lines(`class_name Person
extends RefCounted
var person_name: String
var email: String
func _init(person_name: String, email: String) -> void:
    self.person_name = person_name
    self.email = email
func _to_string() -> String:
    return "%s (%s)" % [person_name, email]`),
'course.gd':lines(`class_name Course
extends RefCounted
signal course_full(title: String)
var title: String
var max_capacity: int
var instructor_name = ""
var student_emails: Array[String] = []
var completed_emails: Array[String] = []
func _init(title: String, max_capacity: int = 30) -> void:
    self.title = title
    self.max_capacity = max_capacity
func add_student(email: String) -> bool:
    if student_emails.size() >= max_capacity or email in student_emails: return false
    student_emails.append(email)
    if student_emails.size() == max_capacity: course_full.emit(title)
    return true
func remove_student(email: String) -> bool:
    if not email in student_emails: return false
    student_emails.erase(email)
    return true
func mark_completed(email: String) -> bool:
    if not remove_student(email): return false
    completed_emails.append(email)
    return true
func assign_instructor(instructor: String) -> bool:
    if instructor_name != "": return false
    instructor_name = instructor
    return true
func _to_string() -> String:
    return "%s: %d/%d studenti, %d completati, docente: %s" % [title, student_emails.size(), max_capacity, completed_emails.size(), instructor_name if instructor_name != "" else "nessuno"]`),
'student.gd':lines(`class_name Student
extends Person
var enrolled: Array[String] = []
var completed: Array[String] = []
func enroll(course: Course) -> bool:
    if course.title in enrolled or course.title in completed: return false
    if not course.add_student(email): return false
    enrolled.append(course.title)
    return true
func unenroll(course: Course) -> bool:
    if not course.title in enrolled: return false
    if not course.remove_student(email): return false
    enrolled.erase(course.title)
    return true
func complete_course(course: Course) -> bool:
    if not course.title in enrolled: return false
    if not course.mark_completed(email): return false
    enrolled.erase(course.title)
    completed.append(course.title)
    return true
func _to_string() -> String:
    return "Studente %s: %d %s, %d completati" % [super._to_string(), enrolled.size(), "iscritto" if enrolled.size() == 1 else "iscritti", completed.size()]`),
'instructor.gd':lines(`class_name Instructor
extends Person
var expertise: String
var course_titles: Array[String] = []
func _init(person_name: String, email: String, expertise: String) -> void:
    super(person_name, email)
    self.expertise = expertise
func assign_to_course(course: Course) -> bool:
    if not course.assign_instructor(person_name): return false
    course_titles.append(course.title)
    return true
func _to_string() -> String:
    return "Docente %s, %s: %s" % [super._to_string(), expertise, ", ".join(course_titles) if not course_titles.is_empty() else "nessun corso"]`)
};
solutions[233]={
 'transaction.gd':lines(`class_name Transaction
extends RefCounted
var kind: String
var amount: float
func _init(kind: String, amount: float) -> void:
    self.kind = kind
    self.amount = amount
func _to_string() -> String:
    return "%s - $%.2f" % [kind.capitalize(), amount]`),
 'account.gd':lines(`@abstract
class_name Account
extends RefCounted
var account_number: String
var owner_name: String
var _balance: float
var balance: float:
    get: return _balance
var _history: Array[Transaction] = []
func _init(account_number: String, owner_name: String, initial_balance: float) -> void:
    self.account_number = account_number
    self.owner_name = owner_name
    _balance = initial_balance
@abstract func account_type() -> String
@abstract func withdrawal_error(amount: float) -> String
func deposit(amount: float) -> Dictionary:
    if amount <= 0: return {"ok": false, "message": "L'importo del deposito deve essere positivo"}
    _balance += amount
    _history.append(Transaction.new("deposito", amount))
    return {"ok": true, "message": "Depositati $%.2f. Nuovo saldo: $%.2f" % [amount, balance]}
func withdraw(amount: float) -> Dictionary:
    if amount <= 0: return {"ok": false, "message": "L'importo del prelievo deve essere positivo"}
    var error = withdrawal_error(amount)
    if error != "": return {"ok": false, "message": error}
    _balance -= amount
    _history.append(Transaction.new("prelievo", amount))
    return {"ok": true, "message": "Prelevati $%.2f. Nuovo saldo: $%.2f%s" % [amount, balance, " (Scoperto)" if balance < 0 else ""]}
func get_history() -> Array[Transaction]:
    return _history
func _to_string() -> String:
    return "%s %s (%s): $%.2f" % [account_type(), account_number, owner_name, balance]`),
 'savings_account.gd':lines(`class_name SavingsAccount
extends Account
const INTEREST_RATE = 0.02
const MIN_BALANCE = 100.0
func account_type() -> String:
    return "Risparmio"
func withdrawal_error(amount: float) -> String:
    return "Impossibile prelevare sotto il saldo minimo di $100.00" if balance - amount < MIN_BALANCE else ""
func apply_interest() -> Dictionary:
    var interest = balance * INTEREST_RATE
    _balance += interest
    _history.append(Transaction.new("interessi", interest))
    return {"ok": true, "message": "Interessi applicati: $%.2f. Nuovo saldo: $%.2f" % [interest, balance]}`),
 'checking_account.gd':lines(`class_name CheckingAccount
extends Account
const OVERDRAFT_LIMIT = 200.0
func account_type() -> String:
    return "Corrente"
func withdrawal_error(amount: float) -> String:
    return "Impossibile superare il limite di scoperto di $200.00" if balance - amount < -OVERDRAFT_LIMIT else ""`),
 'bank.gd':lines(`class_name Bank
extends RefCounted
var bank_name: String
var _accounts = {}
func _init(bank_name: String) -> void:
    self.bank_name = bank_name
func create_account(kind: String, account_number: String, owner_name: String, initial_balance: float) -> Dictionary:
    if _accounts.has(account_number): return {"ok": false, "message": "Il numero di conto esiste già"}
    match kind.to_lower():
        "risparmio": _accounts[account_number] = SavingsAccount.new(account_number, owner_name, initial_balance)
        "corrente": _accounts[account_number] = CheckingAccount.new(account_number, owner_name, initial_balance)
        _: return {"ok": false, "message": "Tipo di conto non valido"}
    return {"ok": true, "message": "Conto di risparmio creato correttamente" if kind.to_lower() == "risparmio" else "Conto corrente creato correttamente"}
func get_account(account_number: String) -> Account:
    return _accounts.get(account_number)
func transfer(from_number: String, to_number: String, amount: float) -> Dictionary:
    var origin = get_account(from_number)
    var target = get_account(to_number)
    if origin == null or target == null: return {"ok": false, "message": "Uno o entrambi i conti non sono stati trovati"}
    var withdrawal = origin.withdraw(amount)
    if not withdrawal["ok"]: return {"ok": false, "message": "Trasferimento non riuscito: " + withdrawal["message"]}
    target.deposit(amount)
    return {"ok": true, "message": "Trasferiti $%.2f da %s a %s" % [amount, from_number, to_number]}
func total_holdings() -> float:
    var total = 0.0
    for account in _accounts.values(): total += account.balance
    return total`)
};
solutions[234]={
'character.gd':lines(`@abstract
class_name Character
extends RefCounted
signal defeated(character_name: String)
var character_name: String
var level = 1
var max_health = 100.0
var health = 100.0
var max_mana = 50
var mana = 50
var strength = 10
var intelligence = 10
var agility = 10
var defense = 5
var abilities: Array[Ability] = []
func _init(character_name: String) -> void:
    self.character_name = character_name
@abstract func class_title() -> String
@abstract func attack_power() -> float
func level_up() -> String:
    level += 1
    max_health += 10
    max_mana += 5
    strength += 1
    intelligence += 1
    agility += 1
    defense += 1
    health = max_health
    mana = max_mana
    return "%s ha raggiunto il livello %d!" % [character_name, level]
func attack(target: Character) -> float:
    print(character_name, " attacca ", target.character_name)
    return target.take_damage(attack_power())
func take_damage(amount: float) -> float:
    var damage = maxf(1.0, amount - defense * 0.5)
    var was_alive = is_alive()
    health = maxf(0.0, health - damage)
    print("%s subisce %.1f danni (PS %.1f)" % [character_name, damage, health])
    if was_alive and not is_alive(): defeated.emit(character_name)
    return damage
func is_alive() -> bool:
    return health > 0
func learn_ability(ability: Ability) -> void:
    abilities.append(ability)
func use_ability(index: int, target: Character) -> float:
    if index < 0 or index >= abilities.size():
        print("%s non possiede l'abilità %d" % [character_name, index])
        return 0.0
    return abilities[index].use(self, target)
func _to_string() -> String:
    return "%s il %s (livello %d): PS %.1f/%.1f, mana %d/%d, FOR %d, INT %d, AGI %d, DIF %d" % [character_name, class_title(), level, health, max_health, mana, max_mana, strength, intelligence, agility, defense]`),
'warrior.gd':lines(`class_name Warrior
extends Character
func _init(character_name: String) -> void:
    super(character_name)
    max_health = 150.0
    health = max_health
    max_mana = 30
    mana = max_mana
    strength = 15
    intelligence = 5
    defense = 8
func class_title() -> String:
    return "Guerriero"
func attack_power() -> float:
    return strength * 1.2
func level_up() -> String:
    var message = super.level_up()
    strength += 2
    max_health += 10
    health = max_health
    return message`),
'mage.gd':lines(`class_name Mage
extends Character
func _init(character_name: String) -> void:
    super(character_name)
    max_health = 80.0
    health = max_health
    max_mana = 150
    mana = max_mana
    strength = 5
    intelligence = 20
    defense = 3
func class_title() -> String:
    return "Mago"
func attack_power() -> float:
    return intelligence * 0.4
func attack(target: Character) -> float:
    var damage = super.attack(target)
    mana = mini(max_mana, mana + 5)
    return damage
func level_up() -> String:
    var message = super.level_up()
    intelligence += 2
    max_mana += 15
    mana = max_mana
    return message`),
'rogue.gd':lines(`class_name Rogue
extends Character
func _init(character_name: String) -> void:
    super(character_name)
    max_health = 100.0
    health = max_health
    max_mana = 60
    mana = max_mana
    strength = 12
    intelligence = 8
    agility = 18
    defense = 4
func class_title() -> String:
    return "Ladro"
func attack_power() -> float:
    return strength * 0.5 + agility * 0.7
func level_up() -> String:
    var message = super.level_up()
    agility += 2
    return message`),
'ability.gd':lines(`class_name Ability
extends RefCounted
var ability_name: String
var mana_cost: int
var damage: float
func _init(ability_name: String, mana_cost: int, damage: float) -> void:
    self.ability_name = ability_name
    self.mana_cost = mana_cost
    self.damage = damage
func use(user: Character, target: Character) -> float:
    if user.mana < mana_cost:
        print(user.character_name, " non ha abbastanza mana per ", ability_name)
        return 0.0
    user.mana -= mana_cost
    print(user.character_name, " lancia ", ability_name, " su ", target.character_name)
    return target.take_damage(damage + user.intelligence * 0.5)`)
};
solutions[235]={
'vehicle.gd':lines(`class_name Vehicle
extends RefCounted
var vin: String
var make: String
var model: String
var daily_rate: int
var available = true
func _init(vin: String, make: String, model: String, daily_rate: int) -> void:
    self.vin = vin
    self.make = make
    self.model = model
    self.daily_rate = daily_rate
func start_rental() -> bool:
    if not available: return false
    available = false
    return true
func end_rental() -> void:
    available = true
func _to_string() -> String:
    return "%s %s (VIN: %s) - %s" % [make, model, vin, "Disponibile" if available else "Noleggiato"]`),
'car.gd':lines(`class_name Car
extends Vehicle
var seats: int
func _init(vin: String, make: String, model: String, daily_rate: int, seats: int) -> void:
    super(vin, make, model, daily_rate)
    self.seats = seats
func _to_string() -> String:
    return "Auto: %s - %d posti" % [super._to_string(), seats]`),
'motorcycle.gd':lines(`class_name Motorcycle
extends Vehicle
var engine_size: int
func _init(vin: String, make: String, model: String, daily_rate: int, engine_size: int) -> void:
    super(vin, make, model, daily_rate)
    self.engine_size = engine_size
func _to_string() -> String:
    return "Motocicletta: %s - %dcc" % [super._to_string(), engine_size]`),
'rental.gd':lines(`class_name Rental
extends RefCounted
var rental_id: String
var vehicle: Vehicle
var customer_name: String
var days: int
var is_active = true
func _init(rental_id: String, vehicle: Vehicle, customer_name: String, days: int) -> void:
    self.rental_id = rental_id
    self.vehicle = vehicle
    self.customer_name = customer_name
    self.days = days
func calculate_cost() -> int:
    return vehicle.daily_rate * days
func end_rental() -> bool:
    if not is_active: return false
    is_active = false
    vehicle.end_rental()
    return true
func _to_string() -> String:
    return "Noleggio %s: %s %s per %s, %d giorni, $%d - %s" % [rental_id, vehicle.make, vehicle.model, customer_name, days, calculate_cost(), "Attivo" if is_active else "Terminato"]`),
'rental_agency.gd':lines(`class_name RentalAgency
extends RefCounted
var agency_name: String
var vehicles = {}
var rentals = {}
var next_rental_id = 1
func _init(agency_name: String) -> void:
    self.agency_name = agency_name
func add_vehicle(vehicle: Vehicle) -> void:
    vehicles[vehicle.vin] = vehicle
func rent_vehicle(vin: String, customer_name: String, days: int) -> String:
    if not vehicles.has(vin) or days < 1: return ""
    var vehicle: Vehicle = vehicles[vin]
    if not vehicle.start_rental(): return ""
    var id = "R%d" % next_rental_id
    next_rental_id += 1
    rentals[id] = Rental.new(id, vehicle, customer_name, days)
    return id
func return_vehicle(rental_id: String) -> bool:
    if not rentals.has(rental_id): return false
    return rentals[rental_id].end_rental()
func available_vehicles() -> Array[Vehicle]:
    var found: Array[Vehicle] = []
    for vehicle in vehicles.values():
        if vehicle.available: found.append(vehicle)
    return found
func total_revenue() -> int:
    var revenue = 0
    for rental in rentals.values(): revenue += rental.calculate_cost()
    return revenue`)
};

module.exports=solutions;
