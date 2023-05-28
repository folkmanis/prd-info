import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from './services/login.service';

export const isLoggedIn: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  return inject(LoginService).isLogin().pipe(
    tap(logged => console.log('is logged in', logged)),
    map(logged => logged || router.parseUrl('/login')),
  );
};
