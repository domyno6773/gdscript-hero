# Policy di inventario e attivazione locale

Prerequisiti: app OAuth e trust esistenti, sei secrets nell'ambiente GitHub
`oci-readonly`, reviewer obbligatorio e branch `main` come unico branch ammesso.
La protezione dell'ambiente GitHub non e verificabile da questo script locale.

Eseguire lo stesso script di bootstrap aggiornato con il nuovo modo:

```powershell
py -3 scripts/oci_trust_setup.py --prepare-activation
```

Il comando chiede Domain URL, Client ID OAuth e Domain OCID; genera offline
un file di policy IAM ed e predisposto ad aprirlo nell'editor predefinito su
Windows. Il file contiene solo identificatori e operazioni List; non contiene
segreti. Non occorre sostituire manualmente il dominio in sei righe.

Nella console OCI creare la policy indicata in **Identity & Security -> Policies**
nel compartment radice (non in Domain policies), con nome
`gdh-github-inventory-readonly`. Policy Builder -> Show manual editor: incollare
tutto il contenuto del file. Il client operativo non deve ricevere il permesso
di creare o modificare questa policy.

Dopo aver verificato e creato la policy, scrivere nel programma
`POLICY SOLA LETTURA CREATA`. Il programma chiede solo allora il percorso del
token personale amministrativo. Se quello precedente e scaduto, generarne uno
nuovo con scadenza breve in My profile -> Tokens and keys -> My access tokens,
per le API Identity Domains nel medesimo dominio. Non inviare il file in chat
e non salvarlo su GitHub.

Prima di proporre l'attivazione il programma legge il trust e l'app, verifica
dominio, client ID, grant client_credentials, scope Explicit vuoto e assenza
di grant assegnati. Richiede gli stessi vincoli esatti del trust gia creato.
Se il controllo e incompleto, ambiguo o differisce, si ferma senza attivare.

Il programma mostra l'azione e richiede `ATTIVA PONTE SOLA LETTURA`; subito
prima delle scritture ripete i controlli. Usa solo `AppStatusChanger` per
attivare l'app e una PATCH condizionale con If-Match per il solo attributo
active del trust. Non cambia claim, scope o ruoli. Rilegge poi entrambi.
Se il trust cambia durante la richiesta, If-Match deve respingere la modifica.
L'API di stato dell'app opera soltanto sull'app identificata e non ne cambia
le autorizzazioni. Errori dopo una scrittura possono lasciare uno stato
parziale; verificare la console prima di riprovare. Nessun retry o rollback
automatico. Una successiva esecuzione verifica anche gli oggetti gia attivi.

Lo script non puo verificare la policy IAM nativa attraverso il token
Identity Domains: la sua creazione e confermata dall'utente. L'efficacia
richiede il successivo Run workflow manuale con `oracle_audit=true`, dopo
approvazione dell'ambiente. Nessun esito locale certifica lo scambio dei token,
quote disponibili o gratuita del futuro hosting. Nessuna VM, rete, disco,
database, upgrade o autorizzazione di provisioning e creato da questo script.

Fonti:
- https://docs.oracle.com/en/cloud/paas/iam-domains-rest-api/op-admin-v1-appstatuschanger-id-put.html
- https://docs.oracle.com/en/cloud/paas/iam-domains-rest-api/op-admin-v1-grants-get.html
- https://docs.oracle.com/en-us/iaas/tools/python/latest/api/identity_domains/client/oci.identity_domains.IdentityDomainsClient.html
- Vedi anche `OCI_FEDERATED_AUDIT_SETUP.md` per i permessi e le fonti IAM native.
