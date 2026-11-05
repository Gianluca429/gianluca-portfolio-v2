# Portfolio V2 — Gianluca Guarino

Nuova base Angular 22 per il rebranding del portfolio, separata dal repository del sito pubblico.

## Avvio
```bash
npm install
npm start
```
Apri http://localhost:4200 (o l'URL mostrato da Angular CLI).

## Navigazione
- `/` — Homepage ibrida
- `/projects` — Archivio progetti
- `/projects/:slug` — Case study
- `/recruiter` — Profilo professionale **indipendente**, senza link dal sito pubblico

## Materiali provvisori
- Visual, immagini, foto, descrizioni e simbolo G sono **placeholder**.
- Il tracciato esatto del logo squadrato concordato verrà ricostruito dai riferimenti originali.
- Il link al CV non è attivo finché non sarà aggiunto il PDF reale.

## Pubblicazione
La V2 è impostata come **preview non indicizzabile** (`robots.txt` e meta robots globali).
Prima del lancio sul dominio principale, riabilitare l'indicizzazione delle pagine pubbliche mantenendo `noindex` sulla pagina `/recruiter` e configurando correttamente il fallback SPA sul servizio hosting.

Il contenuto /recruiter è nascosto dalla navigazione, **non protetto da password**.

## Verifiche
Eseguire `npm run build` sul PC prima del deploy. Il registry npm non è accessibile dall'ambiente di preparazione.

## Revisione V2.1
- Home: hero ripulita, scroll ai lavori, mini presentazione e modulo contatti unico.
- `/metodo`: percorso narrativo a 5 tappe con linea geometrica progressiva su desktop e timeline su mobile.
- Form: validazione Angular Reactive Forms; **non invia al server**; genera una email tramite il programma di posta. Configurare un provider/backend con protezione anti-spam prima della pubblicazione.
- Per installare `@angular/forms` dopo il pull: `npm install`.

## Privacy e cookie — verifica prima della pubblicazione

Sono state create le pagine `/privacy` e `/cookie-policy`, collegate dal footer e dal modulo contatti. Sono bozze che descrivono la versione attuale del codice e **non costituiscono ancora informative definitive**.

Checklist obbligatoria prima del lancio:
- Confermare l'indirizzo email usato per le richieste privacy e la reale identità/recapiti del titolare.
- Verificare hosting, eventuali access log, provider email, tempi di conservazione e trasferimenti extra SEE.
- Analizzare nel browser con DevTools i cookie e altri eventuali strumenti tecnici impostati dalla piattaforma.
- Se si installano analytics, pixel, embed o servizi antispam, aggiornare le informative e configurare, se richiesto, un consenso preventivo.
- Se il modulo passa da `mailto:` a un backend, aggiornare privacy, fornitori, trattamento dei dati, conservazione e protezione antispam.
- Valutare un controllo legale dei testi finali. Non pubblicare la bozza con le note ancora da completare.

La V2 di test resta configurata come noindex globale. /recruiter è accessibile tramite URL diretto, non protetta da autenticazione.

## Marchio
Il simbolo `public/logo-g.svg` è una ricostruzione vettoriale della G squadrata approvata nel concept grafico; viene utilizzato nella navbar e nella pagina recruiter. `public/favicon.svg` riprende lo stesso tracciato in un riquadro scuro. Per nuove applicazioni utilizzare questi asset (non la precedente lettera G stilizzata con CSS). Il rendering finale va controllato in browser prima del rilascio.

## Invio form dal sito (Cloudflare Worker + Resend + Turnstile)

Il form ora fa POST a `/api/contact` e **non utilizza più `mailto:`**. Il Worker in `worker/index.js` valida i campi, verifica un token Cloudflare Turnstile sul server e inoltra a Resend via API. Il pulsante rimane **disabilitato** se l'ambiente non è configurato: non simuliamo un invio.

1. Creare un account Resend, verificare un dominio mittente e generare una API key. Il `from` deve appartenere a un dominio autorizzato.
2. Configurare un widget Cloudflare Turnstile per il dominio del portfolio, ottenere *site key* e *secret key*. Valutare l'impatto privacy e aggiornare le informative.
3. Pubblicare la build Angular con il Worker di `wrangler.jsonc`; le rotte `/api/*` devono andare al Worker, mentre le altre rotte restano asset statici SPA.
4. In Cloudflare configurare **segreti**, non valori nel repository:
   - `RESEND_API_KEY`: chiave API Resend
   - `RESEND_FROM`: mittente verificato, per esempio `Portfolio <contatti@dominio-verificato.it>`
   - `CONTACT_TO_EMAIL`: casella che riceve le richieste
   - `TURNSTILE_SECRET`: chiave segreta Turnstile
   - `TURNSTILE_SITE_KEY`: chiave pubblica Turnstile (può essere variabile normale)
5. Il browser legge solo la *site key* dall'endpoint `GET /api/contact/config`. L'API invia una email plain-text con il mittente del sito e l'indirizzo dell'utente come `reply_to`.
6. Verificare dal dominio configurato: invio valido; form errato; verifica Turnstile fallita; servizio email non disponibile. Controllare recapito e spam.
7. In locale con `npm start` è disponibile soltanto il frontend Angular. Per provare l'invio reale occorre servire anche Worker e asset (build + `npx wrangler dev`), con variabili/segreti locali appropriati. Non caricare le credenziali nel codice client.

**Attenzione:** l'email indicata nella versione precedente, `ciao@gianlucaguarino.it`, non è stata confermata. L'indirizzo destinatario viene per questo configurato con `CONTACT_TO_EMAIL` e non è hardcoded nel Worker. Non pubblicare il modulo prima di aver scelto e configurato correttamente recapito e dominio.

**Privacy:** le informative restano bozze finché non siano verificati davvero hosting, Resend, Turnstile, cookie, trattamenti e periodi di conservazione. Considerare anche rate limiting lato Cloudflare per ridurre abusi; Turnstile e honeypot non sostituiscono una quota/rate limit robusta.
