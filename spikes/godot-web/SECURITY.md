# Sicurezza — Godot Web spike

Questo prototipo dimostra la fattibilità, **non** la sicurezza dell'esecuzione.

## Fatto verificato da Chrome

Uno script GDScript compilato dinamicamente può usare `JavaScriptBridge.get_interface("window")` per modificare una proprietà della pagina ospitante (`gdhSecurityProof`), senza accedere a dati personali. Il test riproducibile si trova in `tests/web_smoke.cjs`.

## Perché NON collegarlo al sito principale

- GDScript non fidato nel medesimo origin della piattaforma può interagire con la pagina e potenzialmente con dati di sessione accessibili da JavaScript.
- Un ciclo infinito può bloccare il thread WebAssembly e rendere l'interfaccia inutilizzabile.
- Un limite di 10.000 caratteri non è una sandbox né un timeout.
- Il runtime può accedere ad altre API di Godot, non soltanto alle funzioni previste dalla lezione.
- Gli utenti possono sviluppare il proprio codice, dunque validare l'output non significa validare l'intenzione didattica.

## Requisiti per qualunque integrazione pubblica

1. Isolare esecuzione e account su **origin diversi**, con messaggistica `postMessage` strettamente validata. Non basta mostrare/nascondere il canvas; verificare gli attributi `sandbox` dell'iframe, CORS e la compatibilità del caricamento WebAssembly.
2. Fornire un kill switch capace di eliminare un worker o un iframe bloccato. Il solo timeout JavaScript sul medesimo thread non interrompe i loop sincroni.
3. Limitare API e traffico di rete con una politica di sicurezza coerente; valutare se serva una build Web custom che escluda `JavaScriptBridge` — il prototipo attuale lo usa per comunicare.
4. Aggiungere verifiche automatizzate di isolamento, persistenza dati, timeout e compatibilità.
5. Progettare un protocollo per variabili locali, segnali, scene e nodi: `Object.get_property_list()` permette di leggere proprietà di istanza ma non le variabili locali temporanee di `_ready()`.

Questo documento non costituisce un audit di sicurezza completo.
