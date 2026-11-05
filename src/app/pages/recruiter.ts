import { Component, OnInit, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
@Component({selector:'app-recruiter',standalone:true,templateUrl:'./recruiter.html'})
export class Recruiter implements OnInit {
  private readonly meta=inject(Meta);
  ngOnInit():void { this.meta.updateTag({name:'robots',content:'noindex,nofollow'}); }
}
