import { Injectable } from '@angular/core';
import { Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleGuard  {

  constructor(
    private loginService: LoginService,
  ) { }


  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.loginService.isModule(route.path);

  }
}
