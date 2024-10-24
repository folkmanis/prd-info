import { Location } from '@angular/common';
import { Directive } from '@angular/core';
import { RouterLink } from '@angular/router';

@Directive({
  selector: '[appRouterLinkToReturn]',
  standalone: true,
  hostDirectives: [RouterLink],
})
export class RouterLinkToReturnDirective {
  constructor(location: Location, routerLink: RouterLink) {
    const state = location.getState();
    if (typeof state['returnUrl'] === 'string') {
      routerLink.routerLink = state['returnUrl'];
    } else {
      routerLink.routerLink = '..';
    }
  }
}
