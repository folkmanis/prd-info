import { Directive, Input, Host, Self } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

/** 'small' directive hides
 * Angular Material mat-drawer on small screens
 */
@Directive({
  selector: 'mat-drawer[small]'
})
export class DrawerSmallDirective {

  /** @input small: boolean sets small screen mode */
  @Input() set small(_input: boolean) {
    this.drawer.opened = !_input;
    this.drawer.mode = _input ? 'over' : 'side';
  }

  constructor(
    @Host() @Self() private drawer: MatDrawer,
  ) { }

}
