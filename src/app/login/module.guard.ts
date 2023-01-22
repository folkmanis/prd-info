import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleGuard implements CanMatch {

  constructor(
    private loginService: LoginService,
  ) { }


  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.loginService.isModule(route.path);

  }
}
