# GDScript Hero — ponte GitHub Actions → Oracle Cloud (OIDC)

**Aggiornamento:** trust inattivo creato e riletto dall'utente con bootstrap locale. Il workflow ora include l'opzione manuale `oracle_audit` (predefinita **false**) e lo script `scripts/oci_federated_readonly.py`. Il percorso federato e verificato offline ma **non ancora collaudato contro OCI**. Richiede secrets nell'ambiente protetto, policy IAM di inventario e attivazione controllata. Il token personale amministrativo resta locale e NON va inserito in GitHub. Vedi `docs/OCI_FEDERATED_AUDIT_SETUP.md`.

**Stato precedente al 27 ottobre 2026:** il primo workflow OIDC è stato aggiunto, ma è **solo un test d'identità GitHub**. Non ha accesso a Oracle Cloud. **Nessuna VM o risorsa OCI è stata creata.**

## Vincolo inderogabile: zero addebiti

L'account OCI deve rimanere **Free Tier, senza upgrade**. Non considerare un controllo inventariale, un report CI, un'etichetta «Always Free eligible» o un avviso budget come garanzia assoluta di costi zero. Non avviare provisioning se piano, quota disponibile, home region, disco, rete e costo finale non sono stati verificati. Nessun comando «create» o «apply» è previsto dal workflow corrente.

## Passaggio 1: proteggi l'ambiente GitHub

Vai in **Settings → Environments → New environment**, crea o apri `oci-readonly`. Imposta **Required reviewers** scegliendo il proprietario del repository e consenti il deployment soltanto dal branch `main`. Se l'ambiente esiste già perché creato automaticamente da GitHub Actions, aggiungi comunque queste protezioni **prima** di collegarlo a Oracle.

GitHub supporta i reviewer obbligatori per gli ambienti dei repository pubblici anche con GitHub Free. Per l'uso con OCI, valuta ulteriori protezioni del branch `main` e non assegnare privilegi di scrittura a collaboratori non fidati.

**Non aggiungere chiavi OCI o altre credenziali ai secrets del repository in questa fase.**

## Passaggio 2: prova il token OIDC GitHub

Apri il workflow **OCI bridge - OIDC identity check (NO CLOUD WRITES)** in [GitHub Actions](https://github.com/domyno6773/gdscript-hero/actions/workflows/oci-oidc-preflight.yml) e clicca **Run workflow → main**.

Il workflow ottiene dal servizio GitHub una credenziale temporanea e stampa **solo** queste informazioni attese:

- `iss`: `https://token.actions.githubusercontent.com`
- `aud`: `gdh-oci-readonly`
- `repository`: `domyno6773/gdscript-hero`
- `sub`: identità **immutabile** (formato `repo:domyno6773@OWNER_ID/gdscript-hero@REPOSITORY_ID:environment:oci-readonly`). Il verificatore confronta gli ID pubblici esatti del repository GitHub, senza stamparli in chiaro nei log.
- `event_name`: `workflow_dispatch`
- `ref`: `refs/heads/main`

Il token completo **non viene stampato né salvato**; il processo non contatta OCI. **Nota 27 ottobre 2026:** il primo test è fallito per una validazione OIDC troppo restrittiva. Per i repository creati dopo il 15 luglio 2026 GitHub usa il formato immutabile del `sub`; il validatore e i test sono stati aggiornati. Dopo la modifica occorre lanciare un **nuovo** `Run workflow` su `main` (non rieseguire il vecchio commit). Se l'identità differisce, fallisce. Comunica in chat soltanto se il controllo è **verde** o **rosso**, senza inviare JWT o altri segreti.

## Passaggio 3: configurazione una tantum in OCI, ancora senza provisioning

Oracle ha introdotto nel 2026 la federazione dei workload esterni (OIDC GitHub → OCI RPST). La configurazione richiede un amministratore OCI che:

1. Verifichi il piano Free Tier e la regione home.
2. Configuri nell'identity domain OCI un'applicazione e un **Identity Propagation Trust** per l'emittente GitHub. Il trust deve verificare **esattamente** repository, workflow, environment e branch: non autorizzare tutti i workflow o tutti i repository.
3. Conceda inizialmente **solo permessi di lettura OCI**, limitati al minimo necessario per verificare i compartimenti e il consumo Always Free. Nessun `manage`, `use`, provisioning, upgrade o permesso Billing.
4. Solo dopo testare lo scambio JWT→RPST e l'inventario **in sola lettura**.

**Attenzione:** la procedura OCI con OAuth Client può richiedere un **client secret** per lo scambio dei token, anche se non richiede una chiave privata API OCI permanente. Un eventuale secret dev'essere custodito in un ambiente GitHub protetto; mai nel repository, nella chat o nei log. L'implementazione di questo scambio non è ancora stata configurata né testata in quest'account.

L'ambiente `oci-readonly` è solo per lettura. Se più avanti si considererà la creazione di una VM, occorreranno un'identità **separata**, policy IAM ristrette a una sola configurazione Always Free e un ambiente `oci-provision` con revisore obbligatorio. **Il workflow di provisioning non esiste ancora.**

## Limiti dell'accesso ChatGPT a GitHub

Il collegamento GitHub attuale permette di modificare il repository e leggere esiti CI, ma **non permette di creare GitHub Secrets, gestire le protezioni degli ambienti o avviare manualmente `workflow_dispatch`**. Il proprietario deve eseguire quei passaggi iniziali dall'interfaccia GitHub. Non bisogna aggirare questa limitazione attribuendo credenziali OCI al codice del sito o a workflow automatici `push`.

## Documentazione ufficiale

- Oracle IAM Workload Identity Federation: https://docs.oracle.com/en-us/iaas/releasenotes/identity/jwt_to_rpst_token_exchange_for_workload_identity_federation.htm
- Oracle JWT→RPST: https://docs.oracle.com/en-us/iaas/Content/Identity/api-getstarted/token_exchange_grant_type_workload_id-federation.htm
- GitHub OIDC: https://docs.github.com/en/actions/reference/security/oidc
- Protezioni GitHub Environments: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- Oracle Always Free: https://docs.oracle.com/it-it/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
