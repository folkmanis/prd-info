import { Component, OnInit } from '@angular/core';
import { LoginService, User } from './login/login.service';
import { USER_MODULES, UserModule } from './user-modules';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidenavService } from './library/services/sidenav.service';

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
  userMenuItems: { route: string[], text: string; }[] = [];
  toolbarTitle = this.sidenavService.title$;
  
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
    this.loginService.user$.subscribe((usr) => {
      this.loggedIn = !!usr;
      this.user = usr && usr.name;
      this.isAdmin = !!usr && !!usr.admin;
      this.initUserMenu(usr);
      this.initModulesMenu(usr);
    });
  }

  onNavigate(t?: string) {
    this.sidenavService.setTitle(t || '');
    // this.router.navigate(path);
    // this.toolbarTitle = path;
  }

  private initUserMenu(usr?: User) {
    this.userMenuItems = [{ route: ['/login'], text: 'Atslēgties' }];
    if (usr && usr.preferences.modules.includes('user-preferences')) {
      this.userMenuItems.push({ route: ['user-preferences'], text: 'Lietotāja iestatījumi' });
    }
  }

  private initModulesMenu(usr?: User) {
    this.userModules = [];
    if (usr) {
      usr.preferences.modules.forEach(mod => {
        const m = USER_MODULES.find(val => val.value === mod);
        if (m) {
          this.userModules.push(m);
        }
      });
    }
  }

}
