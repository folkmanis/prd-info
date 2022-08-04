import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Input, Host, Self } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

/** 'small' directive hides
 * Angular Material mat-drawer on small screens
 */
@Directive({
  selector: 'mat-drawer[small]'
})
export class DrawerSmallDirective {

  private _small = false;
  /** @input small: boolean sets small screen mode */
  @Input() set small(value: any) {
    this._small = coerceBooleanProperty(value);
    this.drawer.opened = !this.small;
    this.drawer.mode = this.small ? 'over' : 'side';
  }
  get small(): boolean {
    return this._small;
  }

  constructor(
    @Host() @Self() private drawer: MatDrawer,
  ) { }

}
