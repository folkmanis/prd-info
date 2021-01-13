import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router, RouterStateSnapshot, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export type RetrieveFn<U> = (route: ActivatedRouteSnapshot) => Observable<U | null>;

interface SavedState {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

export abstract class SimpleFormResolverService<T> implements Resolve<T> {

  constructor(
    private router: Router,
  ) { }

  private savedState: SavedState | undefined;

  protected abstract retrieveFn: RetrieveFn<T>;

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> | Observable<never> {
    this.savedState = { route, state };
    return this.retrieveFn(route).pipe(
      mergeMap(cust => {
        if (cust) {
          return of(cust);
        } else {
          this.cancelNavigation(state);
          return EMPTY;
        }
      })
    );
  }

  reload(): Observable<T> | Observable<never> | undefined {
    if (!this.savedState) { return EMPTY; }
    const { route, state } = this.savedState;
    return this.resolve(route, state);
  }

  private cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
  }

}
