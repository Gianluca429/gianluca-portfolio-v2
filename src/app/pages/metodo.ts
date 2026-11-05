import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

interface MethodStep {
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  paragraphs: readonly string[];
  exampleName: string;
  exampleDescription: string;
  exampleLink: string;
}

@Component({
  selector: 'app-metodo',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './metodo.html',
})
export class Metodo implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('journey') journey?: ElementRef<HTMLElement>;
  readonly lineProgress = signal(0);

  readonly steps: readonly MethodStep[] = [
    {
      number: '01', eyebrow: 'PRIMA DI PROGETTARE', title: 'Capire il contesto.', subtitle: 'Ascolto e analisi',
      paragraphs: [
        'Ogni progetto comincia dalle domande giuste. A chi si rivolge il sito? Quali informazioni devono emergere subito? Qual è l’azione più importante che una persona dovrebbe poter compiere?',
        'Prima di scegliere colori o scrivere componenti, metto ordine tra obiettivi, pubblico, contenuti e vincoli. Questa fase serve a costruire una direzione condivisa, evitando di progettare una pagina bella ma poco utile.',
      ],
      exampleName: 'Osteria Lume',
      exampleDescription: 'Un concept che parte dall’atmosfera e dalle informazioni che un visitatore si aspetta nel sito di un ristorante.',
      exampleLink: '/projects/osteria-lume',
    },
    {
      number: '02', eyebrow: 'DARE UNA DIREZIONE', title: 'Trovare un linguaggio.', subtitle: 'Direzione creativa',
      paragraphs: [
        'Una volta chiarite le priorità, inizio a ragionare sull’identità visiva: riferimenti, tipografia, palette, proporzioni e tono della comunicazione. Non sono scelte puramente decorative: danno al progetto una personalità riconoscibile.',
        'Verifico la direzione con una prima composizione completa, così le scelte possono essere valutate e corrette prima dello sviluppo. Un processo leggibile aiuta a ridurre ripensamenti strutturali in una fase avanzata.',
      ],
      exampleName: 'FORMA Studio',
      exampleDescription: 'Gerarchie, spaziature e un linguaggio editoriale essenziale per dare centralità all’architettura.',
      exampleLink: '/projects/forma-studio',
    },
    {
      number: '03', eyebrow: 'PROGETTARE L’ESPERIENZA', title: 'Guidare lo sguardo.', subtitle: 'Struttura e interfaccia',
      paragraphs: [
        'Una pagina funziona quando è facile orientarsi. Costruisco gerarchie chiare, collegamenti riconoscibili e percorsi che portano naturalmente dal primo impatto all’approfondimento.',
        'In questa fase considero i diversi dispositivi e il comportamento degli elementi interattivi. Il responsive non è un adattamento finale: fa parte delle scelte di progettazione fin dall’inizio.',
      ],
      exampleName: 'DOCK',
      exampleDescription: 'Un e-commerce concept per il workspace tecnologico, con navigazione per categorie, carrello e Setup Builder.',
      exampleLink: '/projects/dock',
    },
    {
      number: '04', eyebrow: 'DAL DESIGN AL CODICE', title: 'Costruire con criterio.', subtitle: 'Sviluppo front-end',
      paragraphs: [
        'Quando la direzione è chiara, passo all’implementazione. Organizzo componenti, stati e stili in modo che ogni parte abbia una responsabilità precisa e l’interfaccia rimanga coerente mentre cresce.',
        'Non cerco soltanto di riprodurre un mockup: verifico interazioni, leggibilità e dettagli che influenzano l’esperienza reale. Dove serve, utilizzo Angular e TypeScript per gestire comportamenti e dati con una struttura mantenibile.',
      ],
      exampleName: 'Pulse Dashboard',
      exampleDescription: 'Una web app personale che esplora Angular Signals, operazioni CRUD e gestione locale dei dati.',
      exampleLink: '/projects/pulse-dashboard',
    },
    {
      number: '05', eyebrow: 'PRIMA DELLA CONSEGNA', title: 'Rifinire, verificare.', subtitle: 'Test e iterazione',
      paragraphs: [
        'Un progetto non è finito quando “si vede bene” sul mio schermo. Controllo comportamento responsive, navigazione, stati dei componenti, contenuti e potenziali problemi di interazione.',
        'Il confronto e la revisione fanno parte del lavoro. Preferisco correggere un dettaglio che non convince piuttosto che considerare definitivo qualcosa soltanto perché è già stato implementato.',
      ],
      exampleName: 'Il portfolio stesso',
      exampleDescription: 'Questa V2 è un laboratorio vivo: le scelte vengono osservate nel browser e riviste prima della pubblicazione.',
      exampleLink: '/projects',
    },
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const target = this.journey?.nativeElement;
    if (!target) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.72;
      const end = viewportHeight * 0.2;
      const total = rect.height + start - end;
      this.lineProgress.set(Math.max(0, Math.min(1, (start - rect.top) / total)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    });
  }
}
