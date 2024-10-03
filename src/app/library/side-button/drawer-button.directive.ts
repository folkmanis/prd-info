import { afterNextRender, afterRender, Directive, Host, Injector, Self, ViewContainerRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawer } from '@angular/material/sidenav';
import { SideButtonComponent } from './side-button.component';
import { DrawerSmallDirective } from '../view-size';

/** adds close/open button to mat-drawer */
@Directive({
  selector: 'mat-drawer[appDrawerButton]',
  standalone: true,
  hostDirectives: [DrawerSmallDirective],
})
export class DrawerButtonDirective {
  constructor(viewContainerRef: ViewContainerRef, @Host() @Self() drawer: MatDrawer, injector: Injector) {
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
