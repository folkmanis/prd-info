import { Component, OnInit } from '@angular/core';
import { LoginService, User } from './login/login.service';
import { USER_MODULES, UserModule } from './user-modules';
import { Observable } from 'rxjs';
import { map, shareReplay, delay, tap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidenavService } from './login/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  isAdmin = false;
  user = '';
  userModules: UserModule[] = [];
  userMenuItems: { route: string[], text: string; }[] = [];
  toolbarTitle$: Observable<string> = this.loginService.activeModule$.pipe(
    map(mod => mod ? mod.description : '')
  );

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.loginService.connect();
    this.loginService.user$.subscribe((usr) => {
      this.loggedIn = !!usr;
      this.user = usr && usr.name;
      this.isAdmin = !!usr && !!usr.admin;
      this.initUserMenu(usr);
      this.initModulesMenu(usr);
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
