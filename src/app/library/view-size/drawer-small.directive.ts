import { Directive, Host, OnInit, Self } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs';
import { LayoutService } from './layout.service';


@Directive({
  selector: 'mat-drawer',
  providers: [DestroyService],
})
export class DrawerSmallDirective implements OnInit {

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
    @Host() @Self() private drawer: MatDrawer,
    private layoutService: LayoutService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.layoutService.isLarge$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(large => this.large = large);
  }


}
