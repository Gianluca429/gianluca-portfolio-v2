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
