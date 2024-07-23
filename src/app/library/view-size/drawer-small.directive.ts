import { Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from './layout.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-drawer,mat-sidenav',
  standalone: true,
})
export class DrawerSmallDirective implements OnInit {
  private drawer: MatDrawer = inject(MatDrawer, { optional: true, self: true, host: true }) || inject(MatSidenav, { optional: true, self: true, host: true });

  private large$ = inject(LayoutService).matches('large').pipe(takeUntilDestroyed());

  ngOnInit(): void {
    this.large$.subscribe((large) => {
      this.drawer.opened = large;
      this.drawer.mode = large ? 'side' : 'over';
    });
  }
}
