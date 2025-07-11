import { Location } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Directive({
  selector: '[appRouterLinkToReturn]',
  standalone: true,
  hostDirectives: [RouterLink],
})
export class RouterLinkToReturnDirective {
  constructor() {
    const routerLink = inject(RouterLink);
    const state = inject(Location).getState();

    if (typeof state?.['returnUrl'] === 'string') {
      routerLink.routerLink = inject(Router).parseUrl(state['returnUrl']);
    } else {
      routerLink.routerLink = '..';
    }
  }
}
