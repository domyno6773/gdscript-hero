# Configurazione iniziale locale del trust OCI

Stato: script preparato e verificato con test offline. **Non eseguito sull'account Oracle.**
Non costituisce un'autorizzazione al provisioning o una verifica dei costi dell'account.

## Scopo e limiti

`scripts/oci_trust_setup.py` riduce la configurazione manuale dell'Identity
Propagation Trust a un'esecuzione locale su Windows (Python 3.10+).
Usa solo la libreria standard. Senza `--apply` mostra il piano offline senza
leggere credenziali o effettuare richieste di rete.

Con `--apply`, legge il token personale da un file locale, controlla che non
esistano trust con l'issuer GitHub, mostra la richiesta e attende la conferma
locale `CREA TRUST INATTIVO`. Crea **solo un trust INATTIVO**, poi lo rilegge
e confronta tutti i vincoli. Non modifica trust esistenti. In caso di esito
incerto non ritenta: verificare la console prima di una nuova esecuzione.

Non attiva l'app, non attiva il trust, non assegna policy IAM e non configura
GitHub Secrets. Non contatta GitHub. Il token personale non deve essere
caricato su GitHub, allegato alla chat o stampato nei log.

Il trust e vincolato al repository con ID immutabili, ambiente `oci-readonly`,
branch `main`, evento manuale e workflow **esistente** `oci-oidc-preflight.yml`.
Il futuro workflow di audit richiedera un aggiornamento esplicito e revisionato
di questo vincolo: non aggiungere wildcard per aggirare la restrizione.

## Prerequisiti

- Applicazione OAuth `gdh-github-readonly` gia registrata senza ruoli amministrativi.
- Domain URL principale del dominio Free e Client ID OAuth della stessa app.
  Il Client ID e diverso dall'Application ID. Non serve il client secret qui.
- Ambiente GitHub `oci-readonly` protetto prima della successiva attivazione.
- Token personale temporaneo dal **medesimo dominio**, con i privilegi necessari
  alle API Identity Domains. Preparare lo script prima di generarlo, con
  scadenza breve (es. 15 minuti). Il formato attualmente accettato e il JWT
  grezzo nel file `tokens.tok`; se il formato differisce lo script si ferma.
- Piano OCI ancora Free Tier: nessun upgrade o modifica del tipo di dominio.

## Esecuzione da una copia locale verificata del repository

Anteprima (non richiede token):

```powershell
py -3 scripts/oci_trust_setup.py
```

Creazione del trust inattivo (richiede token locale e conferma interattiva):

```powershell
py -3 scripts/oci_trust_setup.py --apply
```

Il programma chiede il percorso del file token, **non il contenuto**.
Mantiene la verifica TLS e rifiuta redirect per non inoltrare credenziali.
Accetta solo Domain URL principali Oracle nella forma
`https://idcs-<32 caratteri esadecimali>.identity.oraclecloud.com`.

## Dopo l'esecuzione

La creazione verificata del trust inattivo non significa che il ponte funzioni.
Restano da preparare e verificare: autorizzazioni IAM in sola lettura, workflow
di scambio e inventario, conservazione del client secret nell'ambiente GitHub
protetto, attivazione controllata e test reali. Controllare anche il rifiuto
dei token con claim non autorizzati prima di considerare il trust operativo.
Il controllo dei costi, delle risorse e delle quote rimane obbligatorio prima
di qualsiasi futura VM; questo script non lo effettua.

## Verifica offline

```text
python -m unittest discover -s tests -p 'oci_trust_setup_test.py' -v
```

Riferimenti Oracle:
- https://docs.oracle.com/en-us/iaas/Content/Identity/api-getstarted/token_exchange_grant_type_workload_id-federation.htm
- https://docs.oracle.com/en-us/iaas/Content/Identity/api-getstarted/json_web_token_exchange.htm
- https://docs.oracle.com/en-us/iaas/Content/Identity/usersettings/generate-personal-access-tokens.htm
