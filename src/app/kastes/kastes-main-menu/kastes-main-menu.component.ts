import { Component } from '@angular/core';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]='modules$'></app-card-menu>`,
})
export class KastesMainMenuComponent {

  constructor(
    private loginService: LoginService,
  ) { }

  modules$ = this.loginService.childMenu('kastes');

}
