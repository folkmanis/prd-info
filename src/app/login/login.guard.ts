import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(route.path);
    return this.loginService.isLogin().pipe(
      tap((logged) => {
        if (!logged) {
          this.router.navigate(['login']);
        }
        console.log(logged);
      }),
      switchMap(() => this.loginService.getUser()),
      tap(user=> console.log(user)),
      map(usr => !!usr.preferences.modules.find(m => m === route.path)),

      // switchMap(() => this.loginService.isModule(route.path)),
      // map((user) => !!user.preferences.modules.find(m => m === route.path))
    );
  }

}
