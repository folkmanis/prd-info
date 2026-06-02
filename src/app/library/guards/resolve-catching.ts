import { inject } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';
import { catchError, from, isObservable, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export function resolveCatching<T>(
  url: string,
  resolver: () => Promise<T> | Observable<T>,
): Observable<T | RedirectCommand> {
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  const result = resolver();
  const result$ = isObservable(result) ? result : from(result);
  return result$.pipe(
    catchError((err) => {
      const redirectUrl = router.createUrlTree(url.split('/').slice(0, -1));
      if (err instanceof HttpErrorResponse) {
        snack.open(`Kļūda: ${err.message}`);
      }
      return of(new RedirectCommand(redirectUrl));
    }),
  );
}
