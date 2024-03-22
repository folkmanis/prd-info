import { inject } from '@angular/core';
import { CanMatchFn, Route } from '@angular/router';
import { LoginService } from './services/login.service';

export const isModuleAllowed: CanMatchFn = (route: Route) =>
  inject(LoginService).isModuleAvailable(route.path);
