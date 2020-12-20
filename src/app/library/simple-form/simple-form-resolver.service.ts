import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export type RetrieveFn<U> = () => Observable<U | null>;

@Injectable({ providedIn: 'any' })
export class SimpleFormResolverService {

  constructor(
    private router: Router,
  ) { }

  retrieve<T>(
    state: RouterStateSnapshot,
    retrieveFn: RetrieveFn<T>,
  ): Observable<T> | Observable<never> | undefined {
    return retrieveFn().pipe(
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

  private cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
  }

}
