import { Component, OnInit } from '@angular/core';
import { LoginService, User } from './login/login.service';
import { USER_MODULES } from './user-modules';
import { UserModule } from "./library/classes/user-module-interface";
import { Observable } from 'rxjs';
import { map, shareReplay, delay, tap,filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidenavService } from './login/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  // isAdmin = false;
  user = '';
  userModules: UserModule[] = [];
  userMenuItems: { route: string[], text: string; }[] = [];
  activeTitle: string = '';
  activeRoute: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.loginService.connect();
    this.loginService.user$.pipe(
      filter(usr=>!!usr),
    ).subscribe((usr) => {
      this.loggedIn = true;
      this.user = usr.name;
      // this.isAdmin = !!usr && !!usr.admin;
      this.initUserMenu(usr);
      this.initModulesMenu(usr);
    });
    this.loginService.activeModule$.subscribe(mod => {
      this.activeTitle = mod ? mod.name : '';
      this.activeRoute = mod ? mod.route : '';
    });
  }

  private initUserMenu(usr?: User) {
    this.userMenuItems = [{ route: ['/login'], text: 'Atslēgties' }];
    if (usr && usr.preferences.modules.includes('user-preferences')) {
      this.userMenuItems.push({ route: ['user-preferences'], text: 'Lietotāja iestatījumi' });
    }
  }

  private initModulesMenu(usr?: User) {
    this.userModules = USER_MODULES.reduce((acc, curr) => {
      if (usr && usr.preferences.modules.includes(curr.value)) {
        acc.push(curr);
      }
      return acc;
    }, []);
  }

}
