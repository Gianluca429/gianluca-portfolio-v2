import { Component, DestroyRef, ElementRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface ContactConfig { enabled: boolean; siteKey?: string; }
interface ContactResult { ok: boolean; error?: string; }
interface TurnstileAPI {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}
declare global {
  interface Window { turnstile?: TurnstileAPI; }
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
})
export class ContactForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private widgetId: string | null = null;
  private abort = new AbortController();
  private alive = true;

  readonly attempted = signal(false);
  readonly ready = signal(false);
  readonly loading = signal(true);
  readonly sending = signal(false);
  readonly status = signal<'idle' | 'success' | 'error'>('idle');
  readonly feedback = signal('');
  readonly token = signal('');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    projectType: [''],
    message: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(4000)]],
    companyWebsite: [''], // Honeypot. Hidden from human users.
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.alive = false;
      this.abort.abort();
      if (this.widgetId && window.turnstile) window.turnstile.remove(this.widgetId);
    });
  }

  async ngOnInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const response = await fetch('/api/contact/config', { signal: this.abort.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('not_configured');
      const config = await response.json() as ContactConfig;
      if (!config.enabled || !config.siteKey) throw new Error('not_configured');

      await this.loadTurnstile();
      if (!this.alive || !window.turnstile) return;
      const mount = this.host.nativeElement.querySelector<HTMLElement>('#contact-turnstile');
      if (!mount) return;
      this.widgetId = window.turnstile.render(mount, {
        sitekey: config.siteKey,
        action: 'portfolio_contact',
        callback: (token: unknown) => this.token.set(String(token)),
        'expired-callback': () => this.token.set(''),
        'error-callback': () => this.token.set(''),
        theme: 'dark',
      });
      this.ready.set(true);
    } catch (error) {
      if (!this.alive) return;
      this.feedback.set('Invio dal sito non ancora disponibile: il servizio di recapito deve essere configurato.');
      this.status.set('error');
    } finally {
      if (this.alive) this.loading.set(false);
    }
  }

  private loadTurnstile(): Promise<void> {
    if (window.turnstile) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('turnstile_not_loaded'));
      document.head.appendChild(script);
    });
  }

  async sendMessage(): Promise<void> {
    if (this.sending() || !this.ready()) return;
    this.attempted.set(true);
    this.form.markAllAsTouched();
    this.status.set('idle');
    this.feedback.set('');

    if (this.form.invalid) {
      this.feedback.set('Controlla i campi evidenziati prima di inviare.');
      this.status.set('error');
      return;
    }
    if (!this.token()) {
      this.feedback.set('Completa la verifica antispam per continuare.');
      this.status.set('error');
      return;
    }

    this.sending.set(true);
    try {
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: this.abort.signal,
        body: JSON.stringify({
          ...this.form.getRawValue(),
          turnstileToken: this.token(),
        }),
      });
      const body = await result.json() as ContactResult;
      if (!result.ok || !body.ok) throw new Error(body.error || 'delivery');

      if (!this.alive) return;
      this.form.reset();
      this.attempted.set(false);
      this.status.set('success');
      this.feedback.set('Messaggio inviato! Grazie, ti risponderò appena possibile.');
    } catch (error) {
      if (!this.alive) return;
      this.status.set('error');
      this.feedback.set('Non è stato possibile inviare il messaggio. Riprova tra poco.');
    } finally {
      if (this.alive) {
        this.sending.set(false);
        this.token.set('');
        if (this.widgetId && window.turnstile) window.turnstile.reset(this.widgetId);
      }
    }
  }
}
