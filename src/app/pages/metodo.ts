import { AfterViewInit, Component, DestroyRef, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChild('graphic') graphic?: ElementRef<HTMLElement>;
  @ViewChild('progressPath') progressPath?: ElementRef<SVGPathElement>;
  @ViewChildren('stepMarker') stepMarkers!: QueryList<ElementRef<HTMLElement>>;

  readonly lineProgress = signal(0);
  readonly pathData = signal('M 0 0');
  readonly pathViewBox = signal('0 0 1 1');
  readonly strokeLength = signal(1);
  readonly strokeOffset = signal(1);
  readonly arrowData = signal('M 0 0');
  readonly arrowVisible = signal(false);

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
    const graphic = this.graphic?.nativeElement;
    const progressPath = this.progressPath?.nativeElement;
    if (!target || !graphic || !progressPath) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let totalLength = 1;

    const markerCenters = () => this.stepMarkers.toArray().map((marker) => {
      const rect = marker.nativeElement.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });

    const rebuildPath = () => {
      const bounds = graphic.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      // Restore the original squared, serpentine line geometry.
      // Coordinates are proportional to the original 1000 x 1950 SVG.
      const x = (value: number) => (value / 1000) * width;
      const y = (value: number) => (value / 1950) * height;
      if (width <= 0 || height <= 0) return;

      const path = [
        `M ${x(500)} ${y(0)}`,
        `V ${y(210)}`,
        `Q ${x(500)} ${y(245)} ${x(535)} ${y(245)}`,
        `H ${x(815)}`,
        `Q ${x(850)} ${y(245)} ${x(850)} ${y(280)}`,
        `V ${y(550)}`,
        `Q ${x(850)} ${y(585)} ${x(815)} ${y(585)}`,
        `H ${x(185)}`,
        `Q ${x(150)} ${y(585)} ${x(150)} ${y(620)}`,
        `V ${y(900)}`,
        `Q ${x(150)} ${y(935)} ${x(185)} ${y(935)}`,
        `H ${x(815)}`,
        `Q ${x(850)} ${y(935)} ${x(850)} ${y(970)}`,
        `V ${y(1250)}`,
        `Q ${x(850)} ${y(1285)} ${x(815)} ${y(1285)}`,
        `H ${x(185)}`,
        `Q ${x(150)} ${y(1285)} ${x(150)} ${y(1320)}`,
        `V ${y(1600)}`,
        `Q ${x(150)} ${y(1635)} ${x(185)} ${y(1635)}`,
        `H ${x(500)}`,
        `V ${y(1907)}`,
      ].join(' ');

      this.pathData.set(path);
      this.pathViewBox.set('0 0 ' + width + ' ' + height);

      // Measure the *actual* SVG path, after updating the geometry.
      progressPath.setAttribute('d', path);
      totalLength = progressPath.getTotalLength();
      this.strokeLength.set(totalLength);
    };

    const updateScroll = () => {
      const centers = markerCenters();
      if (centers.length !== this.steps.length) return;
      const playhead = window.innerHeight * 0.58;

      // The mobile line follows the same reading position, from first to last step.
      const mobileRange = Math.max(1, centers[centers.length - 1].y - centers[0].y);
      const mobileRatio = Math.max(0, Math.min(1, (playhead - centers[0].y) / mobileRange));
      this.lineProgress.set(reducedMotion ? 1 : mobileRatio);

      if (graphic.getBoundingClientRect().height <= 0 || totalLength <= 1) return;

      const bounds = graphic.getBoundingClientRect();
      const firstPoint = progressPath.getPointAtLength(0);
      const lastPoint = progressPath.getPointAtLength(totalLength);
      const relativeY = playhead - bounds.top;
      // Map scrolling to arc length without sudden jumps at the original
      // horizontal runs. Blend the path's vertical coordinate with distance
      // travelled, so a flat segment receives a little scroll distance.
      const virtualY = (length: number) => {
        const verticalY = progressPath.getPointAtLength(length).y;
        const distanceY = firstPoint.y
          + (lastPoint.y - firstPoint.y) * (length / totalLength);
        return verticalY * 0.65 + distanceY * 0.35;
      };

      let lo = 0;
      let hi = totalLength;
      for (let i = 0; i < 20; i++) {
        const middle = (lo + hi) / 2;
        if (virtualY(middle) < relativeY) lo = middle;
        else hi = middle;
      }
      const lengthShown = reducedMotion
        ? totalLength
        : relativeY <= firstPoint.y ? 0
        : relativeY >= lastPoint.y ? totalLength
        : (lo + hi) / 2;

      this.strokeOffset.set(totalLength - lengthShown);
      this.arrowVisible.set(lengthShown > 2);

      // Arrow tip follows the currently drawn end, including in reverse scroll.
      const tip = progressPath.getPointAtLength(lengthShown);
      const prev = progressPath.getPointAtLength(Math.max(0, lengthShown - 18));
      const angle = Math.atan2(tip.y - prev.y, tip.x - prev.x);
      const wing = 14;
      const spread = 0.62;
      const ax = tip.x - wing * Math.cos(angle - spread);
      const ay = tip.y - wing * Math.sin(angle - spread);
      const bx = tip.x - wing * Math.cos(angle + spread);
      const by = tip.y - wing * Math.sin(angle + spread);
      this.arrowData.set('M ' + ax + ' ' + ay + ' L ' + tip.x + ' ' + tip.y + ' L ' + bx + ' ' + by);
    };

    const scheduleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateScroll();
      });
    };

    const scheduleRebuild = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        rebuildPath();
        updateScroll();
      });
    };

    const observer = new ResizeObserver(scheduleRebuild);
    observer.observe(target);
    observer.observe(graphic);

    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleRebuild);
    scheduleRebuild();

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleRebuild);
      if (frame) window.cancelAnimationFrame(frame);
    });
  }
}
