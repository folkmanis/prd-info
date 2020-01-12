import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class PasutijumsGuard implements CanActivate {

  constructor(
    private router: Router,
    private preferencesService: PreferencesService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.preferencesService.getPasutijums().pipe(map((pas) => {
      if (pas) {
        return true;
      } else {
        this.preferencesService.redirect = state.url;
        this.router.navigate(['/preferences']);
        return false;
      }
    }));
  }

}
