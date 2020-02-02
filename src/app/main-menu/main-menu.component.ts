import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  menuItems$ = this.loginService.modules$;

  ngOnInit() {
  }

}
