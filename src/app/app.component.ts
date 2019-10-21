import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  user = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginService.user$.subscribe((usr) => {
      this.loggedIn = !!usr;
      this.user = usr && usr.name;
    });
  }

  onLogout() {
    this.loginService.logOut().subscribe((act) => act && this.router.navigate(['/login']));
  }
}
