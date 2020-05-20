import { Component } from '@angular/core';
import { LoginService } from '../../../login/login.service';

@Component({
  selector: 'app-admin-main-menu',
  template: `<app-card-menu [modules]="modules$"></app-card-menu>`,
})
export class AdminMainMenuComponent {

  constructor(
    private loginService: LoginService,
  ) { }
  modules$ = this.loginService.childMenu('admin');

}
