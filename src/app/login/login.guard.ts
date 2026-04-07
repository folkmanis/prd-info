import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from './services/login.service';
import { map, Observable, take } from 'rxjs';

export const isLoggedIn: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const loginUrl = inject(Router).parseUrl('/login');
  return inject(LoginService).user$.pipe(
    take(1),
    map((user) => (user ? true : loginUrl)),
  );
};
