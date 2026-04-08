import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';
import { catchError, from, isObservable, Observable, of } from 'rxjs';

export function resolveCatching<T>(
  url: string,
  resolver: () => Promise<T> | Observable<T>,
): Observable<T | RedirectCommand> {
  const result = resolver();
  const result$ = isObservable(result) ? result : from(result);
  return result$.pipe(
    catchError(() => {
      const redirectUrl = inject(Router).createUrlTree(url.split('/').slice(0, -1));
      return of(new RedirectCommand(redirectUrl));
    }),
  );
}
