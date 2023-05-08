import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.loginService.isLogin().pipe(
      map(logged => logged || this.router.parseUrl('/login')),
    );
  }

}
