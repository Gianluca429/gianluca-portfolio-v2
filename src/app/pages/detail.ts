import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS } from '../data/projects';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
@Component({selector:'app-detail',standalone:true,imports:[RouterLink,Header,Footer],templateUrl:'./detail.html'})
export class Detail {
  private readonly route=inject(ActivatedRoute);
  readonly project=PROJECTS.find(p=>p.slug===this.route.snapshot.paramMap.get('slug'));
}
