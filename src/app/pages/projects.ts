import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../data/projects';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
@Component({selector:'app-projects',standalone:true,imports:[RouterLink,Header,Footer],templateUrl:'./projects.html'})
export class Projects { readonly items=PROJECTS; }
