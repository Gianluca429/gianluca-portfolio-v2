import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly attempted = signal(false);
  readonly mailReady = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    projectType: [''],
    message: ['', [Validators.required, Validators.minLength(15)]],
  });

  prepareEmail(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.mailReady.set(false);
      return;
    }

    const { name, email, projectType, message } = this.form.getRawValue();
    const subject = 'Richiesta dal portfolio — ' + name.trim();
    const body = [
      'Nome: ' + name.trim(),
      'Email: ' + email.trim(),
      'Tipo di progetto: ' + (projectType || 'Non specificato'),
      '',
      'Messaggio:',
      message.trim(),
    ].join('\n');

    // Temporaneo: apre il client email, non effettua una chiamata a un backend.
    const mailto = 'mailto:ciao@gianlucaguarino.it?subject='
      + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    this.mailReady.set(true);
    if (typeof window !== 'undefined') window.location.href = mailto;
  }
}
