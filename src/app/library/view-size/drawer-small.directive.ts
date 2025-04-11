import { Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from './layout.service';

@Directive({
  selector: 'mat-drawer[appDrawerSmall],mat-sidenav[appDrawerSmall]',
  standalone: true,
})
export class DrawerSmallDirective implements OnInit {
  private drawer: MatDrawer | null = inject(MatDrawer, { optional: true, self: true, host: true }) || inject(MatSidenav, { optional: true, self: true, host: true });

  private large$ = inject(LayoutService).matches('large').pipe(takeUntilDestroyed());

  ngOnInit(): void {
    this.large$.subscribe((large) => {
      if (this.drawer) {
        this.drawer.opened = large;
        this.drawer.mode = large ? 'side' : 'over';
      }
    });
  }
}
