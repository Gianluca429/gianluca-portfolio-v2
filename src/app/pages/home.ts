import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../data/projects';
import { ContactForm } from '../components/contact-form';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Header, Footer, ContactForm],
  templateUrl: './home.html',
})
export class Home {
  readonly featured = PROJECTS.slice(0, 3);
}
