import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';

@Component({
  template: `<app-card-menu [modules]='modules$'></app-card-menu>`,
})
export class MainMenuComponent {

  constructor(
    private loginService: LoginService,
  ) { }
  modules$ = this.loginService.childMenu('jobs-admin');

}
