import { Component } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';

@Component({
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent {

  constructor(
    private loginService: LoginService,
  ) { }
  modules$ = this.loginService.childMenu('jobs');

}
