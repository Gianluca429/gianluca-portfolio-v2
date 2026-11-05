import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './privacy.html',
})
export class Privacy {}
