import { Directive, Host, Self, ViewContainerRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawer } from '@angular/material/sidenav';
import { SideButtonComponent } from './side-button.component';

/** adds close/open button to mat-drawer */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-drawer[button]',
  standalone: true,
})
export class DrawerButtonDirective {
  constructor(viewContainerRef: ViewContainerRef, @Host() @Self() drawer: MatDrawer) {
    const buttonRef = viewContainerRef.createComponent(SideButtonComponent);
    drawer.position = 'end';

    buttonRef.instance.drawer = drawer;
    buttonRef.instance.opened = toSignal(drawer.openedChange, {
      initialValue: drawer.opened,
    });
  }
}
