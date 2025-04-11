import { Location } from '@angular/common';
import { Directive } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Directive({
  selector: '[appRouterLinkToReturn]',
  standalone: true,
  hostDirectives: [RouterLink],
})
export class RouterLinkToReturnDirective {
  constructor(location: Location, routerLink: RouterLink, router: Router) {
    const state = location.getState();
    if (typeof state?.['returnUrl'] === 'string') {
      routerLink.routerLink = router.parseUrl(state['returnUrl']);
    } else {
      routerLink.routerLink = '..';
    }
  }
}
