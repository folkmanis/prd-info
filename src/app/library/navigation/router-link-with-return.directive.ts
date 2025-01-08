import { Directive, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router, RouterLink, UrlTree } from '@angular/router';

@Directive({
  selector: '[appRouterLinkWithReturn]',
  standalone: true,
})
export class RouterLinkWithReturnDirective extends RouterLink implements OnChanges, OnDestroy {
  private localRouter = inject(Router);
  @Input('appRouterLinkWithReturn')
  set appRouterLinkWithReturn(commandsOrUrlTree: any[] | string | UrlTree | null | undefined) {
    this.routerLink = commandsOrUrlTree;
  }

  @Input()
  returnUrl: string;

  onClick(...args: [number, boolean, boolean, boolean, boolean]): boolean {
    this.state = this.state ?? {};
    this.state.returnUrl = this.returnUrl ?? this.localRouter.url;
    return super.onClick(...args);
  }
}
