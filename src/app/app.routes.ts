import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Gianluca Guarino | Front-end & Web Design', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'projects', title: 'Progetti | Gianluca Guarino', loadComponent: () => import('./pages/projects').then((m) => m.Projects) },
  { path: 'projects/:slug', title: 'Case study | Gianluca Guarino', loadComponent: () => import('./pages/detail').then((m) => m.Detail) },
  { path: 'metodo', title: 'Metodo di lavoro | Gianluca Guarino', loadComponent: () => import('./pages/metodo').then((m) => m.Metodo) },
  { path: 'privacy', title: 'Privacy Policy | Gianluca Guarino', loadComponent: () => import('./pages/privacy').then((m) => m.Privacy) },
  { path: 'cookie-policy', title: 'Cookie Policy | Gianluca Guarino', loadComponent: () => import('./pages/cookie-policy').then((m) => m.CookiePolicy) },
  { path: 'recruiter', title: 'Profilo professionale | Gianluca Guarino', loadComponent: () => import('./pages/recruiter').then((m) => m.Recruiter) },
  { path: '**', redirectTo: '' },
];
