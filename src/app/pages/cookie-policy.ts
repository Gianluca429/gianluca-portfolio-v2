import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [RouterLink, Header, Footer],
  templateUrl: './cookie-policy.html',
})
export class CookiePolicy {}
