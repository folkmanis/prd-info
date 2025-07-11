import { afterNextRender, Directive, Injector, ViewContainerRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerSmallDirective } from '../view-size';
import { SideButtonComponent } from './side-button.component';

/** adds close/open button to mat-drawer */
@Directive({
  selector: 'mat-drawer[appDrawerButton]',
  standalone: true,
  hostDirectives: [DrawerSmallDirective],
})
export class DrawerButtonDirective {
  constructor() {
    const viewContainerRef = inject(ViewContainerRef);
    const drawer = inject(MatDrawer, { host: true, self: true });
    const injector = inject(Injector);

    afterNextRender({
      write() {
        const buttonRef = viewContainerRef.createComponent(SideButtonComponent);
        drawer.position = 'end';

        buttonRef.instance.drawer = drawer;
        buttonRef.instance.opened = toSignal(drawer.openedChange, {
          initialValue: drawer.opened,
          injector,
        });
      },
    });
  }
}
