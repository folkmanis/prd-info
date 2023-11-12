import { Directive, Host, OnInit, Self, ViewContainerRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDrawer } from '@angular/material/sidenav';
import { DestroyService } from 'src/app/library/rxjs';
import { SideButtonComponent } from './side-button.component';

/** adds close/open button to mat-drawer */
@Directive({
  selector: 'mat-drawer[button]',
  standalone: true,
  providers: [DestroyService],
})
export class DrawerButtonDirective {
  constructor(
    viewContainerRef: ViewContainerRef,
    @Host() @Self() drawer: MatDrawer
  ) {
    const buttonRef = viewContainerRef.createComponent(SideButtonComponent);
    drawer.position = 'end';

    buttonRef.instance.drawer = drawer;
    buttonRef.instance.opened = toSignal(drawer.openedChange, {
      initialValue: drawer.opened,
    });
  }
}
