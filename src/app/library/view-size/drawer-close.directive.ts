import { Directive, effect, inject } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Directive({
  selector: 'mat-drawer[appDrawerClose],mat-sidenav[appDrawerClose]',
})
export class DrawerCloseDirective {
  #drawer: MatDrawer | null =
    inject(MatDrawer, { optional: true, self: true, host: true }) ||
    inject(MatSidenav, { optional: true, self: true, host: true });
  #navigation = inject(Router).currentNavigation;

  constructor() {
    effect(() => {
      if (this.#drawer && this.#navigation() && this.#drawer.mode !== 'side' && this.#drawer.opened) {
        this.#drawer.close();
      }
    });
  }
}
