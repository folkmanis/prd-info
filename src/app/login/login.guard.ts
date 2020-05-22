import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { LoginActions } from 'src/app/actions';
import { StoreState } from 'src/app/interfaces';
import { selectSystem } from 'src/app/selectors';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad, CanActivate {

  constructor(
    private store: Store<StoreState>,
    private router: Router,
  ) { }

  private isLogin$: Observable<boolean> = this.store.select(selectSystem).pipe(
    filter(state => state.initialised),
    map(state => !!state.user),
    take(1),
  );

  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectSystem).pipe(
      filter(state => state.initialised),
      map(state => !!state.user.preferences.modules.find(m => m === route.path)),
      take(1),
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLogin$.pipe(
      tap(logged => logged || this.router.navigate(['login'])),
      tap(() => this.store.dispatch(LoginActions.routeChanged({ route: route.routeConfig.path })))
    );
  }

}
