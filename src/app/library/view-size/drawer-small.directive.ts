import { Optional, Directive, Host, OnInit, Self } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { DestroyService } from 'src/app/library/rxjs';
import { takeUntil } from 'rxjs';
import { LayoutService } from './layout.service';

@Directive({
    selector: 'mat-drawer,mat-sidenav',
    providers: [DestroyService],
    standalone: true,
})
export class DrawerSmallDirective implements OnInit {
  private drawer: MatDrawer;

  private _large = false;
  set large(value: boolean) {
    this._large = value;
    this.drawer.opened = this.large;
    this.drawer.mode = this.large ? 'side' : 'over';
  }
  get large(): boolean {
    return this._large;
  }

  constructor(
    @Optional() @Host() @Self() drawer: MatDrawer,
    @Optional() @Host() @Self() sidenav: MatSidenav,
    private layoutService: LayoutService,
    private destroy$: DestroyService
  ) {
    this.drawer = drawer || sidenav;
  }

  ngOnInit(): void {
    this.layoutService.isLarge$
      .pipe(takeUntil(this.destroy$))
      .subscribe((large) => (this.large = large));
  }
}
