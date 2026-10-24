# 🎮 GDScript Hero (Versione Locale Offline)

Un'applicazione educativa, interattiva e gamificata per imparare a programmare videogiochi in **GDScript per Godot 4**, pensata per girare al 100% in locale sul tuo computer.

---

## 🚀 Nuove Funzionalità Aggiornate

1. **Nuova Identità: GDScript Hero**:
   - Branding rinnovato con look moderno, icone personalizzate e stile dark gaming.

2. **Pannello Output Stile Coddy (Affiancato)**:
   - **Tuo Output (Reale)**: mostra esattamente ciò che il tuo codice stampa in console o gli eventuali errori di sintassi.
   - **Output Previsto (Atteso)**: mostra l'output obiettivo che la lezione richiede di produrre.
   - **Verifica Requisiti**: checklist con esito verde (✅) o rosso (❌) per ogni singolo test.

3. **IDE Smart Assistant (Editor Intelligente)**:
   - **Auto-Closing delle Coppie**:
     - Digitando `(` inserisce in automatico `)` con il cursore in mezzo.
     - Digitando `"` inserisce in automatico `"` con il cursore in mezzo.
     - Digitando `'`, `[`, `{` gestisce le rispettive chiusure e cancellazioni intelligenti (Backspace cancella la coppia).
     - Riconosce quando il carattere di chiusura è già presente e fa skip senza duplicarlo.
   - **Testo Predittivo & Intellisense**:
     - Menu popup a comparsa rapida mentre scrivi.
     - Suggerisce parole chiave di GDScript (`print`, `Vector2`, `_ready`, `var`, `func`, `int`, `float`, `String`...).
     - **Rileva in tempo reale le variabili create da te nel codice** (es. `player_name`, `health`, `pos`, `speed`) e te le propone!
     - Navigabile con le frecce <kbd>↓</kbd> / <kbd>↑</kbd> e selezionabile con <kbd>Tab</kbd> o <kbd>Invio</kbd>.

4. **Verifica Robusta (Nessun Blocco)**:
   - Motore di compilazione protetto: la verifica non si blocca mai, gestisce qualsiasi errore di battitura e sblocca sempre il pulsante "Verifica Codice".

5. **Gamification & Suoni Offline**:
   - Punti XP, serie giornaliera (Streak 🔥), livelli giocatore, coriandoli e suoni sintetizzati con Web Audio API.

---

## 💻 Come Avviarlo

- **Doppio clic** su `avvia.bat` (o direttamente su `index.html`)
- Oppure via server Python: `python server.py`
