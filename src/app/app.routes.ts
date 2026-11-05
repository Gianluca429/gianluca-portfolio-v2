import { Routes } from '@angular/router';
export const routes:Routes=[
{path:'',title:'Gianluca Guarino | Front-end & Web Design',loadComponent:()=>import('./pages/home').then(x=>x.Home)},
{path:'projects',title:'Progetti | Gianluca Guarino',loadComponent:()=>import('./pages/projects').then(x=>x.Projects)},
{path:'projects/:slug',title:'Case study | Gianluca Guarino',loadComponent:()=>import('./pages/detail').then(x=>x.Detail)},
{path:'recruiter',title:'Profilo professionale | Gianluca Guarino',loadComponent:()=>import('./pages/recruiter').then(x=>x.Recruiter)},
{path:'**',redirectTo:''}
];
