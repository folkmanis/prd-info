import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { USER_MODULES, UserModule } from './user-modules';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  isAdmin = false;
  user = '';
  userModules: UserModule[];

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginService.user$.subscribe((usr) => {
      this.loggedIn = !!usr;
      this.user = usr && usr.name;
      this.isAdmin = !!usr && !!usr.admin;
      this.userModules = [];
      if (usr) {
        usr.preferences.modules.forEach(mod => {
          const m = USER_MODULES.find(val => val.value === mod);
          if (m) {
            this.userModules.push(m);
          }
        });
      }
    });
  }

  onLogout() {
    this.loginService.logOut().subscribe((act) => act && this.router.navigate(['/login']));
  }
}
