import { afterNextRender, Directive, inject, inputBinding, outputBinding, ViewContainerRef } from '@angular/core';
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

    const opened = toSignal(drawer.openedChange, {
      initialValue: drawer.opened,
    });

    drawer.position = 'end';

    afterNextRender({
      write() {
        viewContainerRef.createComponent(SideButtonComponent, {
          bindings: [
            inputBinding('opened', opened),
            outputBinding('toggleDrawer', () => {
              drawer.toggle();
            }),
          ],
        });
      },
    });
  }
}
