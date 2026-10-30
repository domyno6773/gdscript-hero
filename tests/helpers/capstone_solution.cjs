'use strict';
module.exports=starter=>starter
 .replace('        # TODO A:', '        oggetti.append(nome)\n        # TODO A:')
 .replace('    # TODO B:', '    $Coin.body_entered.connect(_raccogli)\n    $AttaccaBtn.pressed.connect(_colpisci_bersaglio)\n    tesoro_raccolto.connect(_aggiorna_hud)\n    # TODO B:')
 .replace('    # TODO C:', '    $Player.velocity = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down") * 120.0\n    $Player.move_and_slide()\n    # TODO C:')
 .replace('    # TODO 1:', '    zaino.aggiungi("Moneta")\n    monete += 1\n    tesoro_raccolto.emit(monete)\n    $Coin.queue_free()\n    # TODO 1:')
 .replace('    # TODO 4:', '    boss["hp"] -= 10\n    if boss["hp"] < 0:\n        boss["hp"] = 0\n    _aggiorna_stato()\n    # TODO 4:');
