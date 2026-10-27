# Collegamento federato di inventario OCI

## Stato verificato

- Preflight GitHub eseguito con successo.
- Utente: trust creato INATTIVO e riletto con i vincoli confermati.
- Script di scambio e inventario preparati; test offline e inizializzazione
  dei client Oracle SDK con firma temporanea verificati.
- **Scambio reale, policy IAM effettive e inventario dell'account non ancora verificati.**

Il vecchio audit con chiave API rimane compatibile, ma il nuovo percorso usa
`oci_federated_readonly.py`: nessun token personale amministrativo, API key
permanente o chiave privata OCI va aggiunto a GitHub.

## Ambiente GitHub prima dell'abilitazione

In Settings -> Environments -> `oci-readonly`:

1. Required reviewers: proprietario del repository.
2. Deployment branches: solo `main` (branch, nessun tag).
3. Aggiungere i seguenti **environment secrets**, non secrets globali del repo:

| Nome | Valore |
|---|---|
| `OCI_FED_DOMAIN_URL` | Domain URL principale HTTPS del dominio Free |
| `OCI_FED_CLIENT_ID` | Client ID OAuth dell'app senza ruoli amministrativi |
| `OCI_FED_CLIENT_SECRET` | Client secret della medesima applicazione |
| `OCI_FED_TENANCY` | OCID della tenancy (non del dominio o del compartment secondario) |
| `OCI_FED_REGION` | `eu-milan-1`; lo script verifichera che sia home region della tenancy |
| `OCI_FED_DOMAIN_OCID` | OCID del dominio Default contenente app e trust |

Confermare separatamente che il piano OCI sia ancora Free Tier. Non effettuare
upgrade del piano o del dominio per sbloccare una funzione.

## Policy IAM di inventario: modello da verificare nella console

Creare solo dopo aver revisionato l'account e sostituito `DOMAIN_OCID` con
l'OCID esatto del dominio. Il modello usa esclusivamente operazioni List
necessarie allo script. Non sostituire con `manage all-resources` o rimuovere
le condizioni per risolvere un errore. La validita e l'efficacia della policy
devono essere confermate nell'account; non sono state collaudate dal repository.

Policy nel compartment radice, nome suggerito `gdh-github-inventory-readonly`:

```text
Allow any-user to inspect tenancies in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', request.operation='ListRegionSubscriptions'}
Allow any-user to inspect compartments in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', any {request.operation='ListCompartments', request.operation='ListAvailabilityDomains'}}
Allow any-user to read instances in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', request.operation='ListInstances'}
Allow any-user to inspect volumes in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', any {request.operation='ListVolumes', request.operation='ListBootVolumes', request.operation='ListVolumeBackups', request.operation='ListBootVolumeBackups'}}
Allow any-user to inspect volume-backups in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', request.operation='ListVolumeBackups'}
Allow any-user to inspect boot-volume-backups in tenancy where all {request.principal.type='gdhgithubreadonly', request.domain.id='DOMAIN_OCID', request.operation='ListBootVolumeBackups'}
```

`ListInstances` richiede INSTANCE_READ; backup list richiede anche VOLUME_INSPECT.
Il trust limita ulteriormente l'emittente, sub immutabile, workflow, branch,
ambiente, evento e audience. Il principal di questa integrazione e distinto da
qualsiasi futuro principal di provisioning. Nessun accesso a console, dati
nei dischi, segreti, policy IAM o modifiche di infrastruttura e richiesto.

## Attivazione e prova reale: ancora da completare

Occorre abilitare l'app e il trust verificato dopo il controllo dei permessi.
Lo script di bootstrap iniziale non attiva nulla. Non rieseguire `--apply`
per attivare: rifiuta deliberatamente trust gia esistenti.

Nel workflow **OCI bridge - OIDC identity check (NO CLOUD WRITES)**:
- `oracle_audit=false` (predefinito) esegue soltanto il preflight GitHub;
- `oracle_audit=true` richiede l'ambiente protetto e tenta lo scambio JWT ->
  RPST (20 minuti), genera in memoria una chiave temporanea e usa solo le API
  list_* dell'inventario. Non salva token, chiavi o risposte grezze nei log.

Un errore 401/403 non autorizza ad ampliare i permessi. Leggere la categoria
sanitizzata e controllare app/trust/policy. Testare anche il rifiuto di claim
non autorizzati senza alterare i vincoli permanenti o esporre token.

L'inventario copre soltanto Compute, boot/block storage e relativi backup nella
home region: **non e una verifica completa delle quote, del piano o dei costi**.
Le soglie ereditate sono valori guida conservativi, non quote lette dall'account.
Rete, altri servizi, limiti effettivi e dettagli di costo richiedono verifiche
ulteriori prima di autorizzare qualsiasi provisioning Always Free.

## Fonti primarie

- https://docs.oracle.com/en-us/iaas/Content/Identity/api-getstarted/token_exchange_grant_type_workload_id-federation.htm
- https://docs.oracle.com/en-us/iaas/tools/python/latest/api/signing.html
- https://docs.oracle.com/en-us/iaas/Content/Identity/policyreference/policyreference_topic-General_Variables_for_All_Requests.htm
- https://docs.oracle.com/en-us/iaas/Content/Identity/policyreference/iampolicyreference.htm
- https://docs.oracle.com/en-us/iaas/Content/Identity/policyreference/corepolicyreference_topic-Permissions_Required_for_Each_API_Operation.htm
