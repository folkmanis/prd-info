import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { LoginService } from '../services';
import { SystemPreferencesService } from '../services/system-preferences.service';
import { USER_MODULES } from '../user-modules';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad, CanActivate {

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    private router: Router,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.user$.pipe(
      take(1),
      tap(usr => usr || this.router.navigate(['login'])),
      map(usr => !!usr.preferences.modules.find(m => m === route.path)),
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.isLogin$.pipe(
      tap(logged => logged || this.router.navigate(['login'])),
      tap(() => this.systemPreferencesService.setActiveModule(USER_MODULES.find(mod => mod.route === route.routeConfig.path) || null))
    );
  }

}
