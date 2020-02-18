import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { USER_MODULES } from '../user-modules';
import { tap, switchMap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad, CanActivate {

  constructor(
    private loginService: LoginService,
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
      tap(() => this.loginService.setActiveModule(USER_MODULES.find(mod => mod.route === route.routeConfig.path) || null))
    );
  }

}
