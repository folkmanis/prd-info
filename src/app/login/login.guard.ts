import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from './services/login.service';

export const isLoggedIn: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  return (await inject(LoginService).isLoggedIn()) || router.parseUrl('/login');
};
