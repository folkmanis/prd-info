import { ChangeDetectorRef, Directive, Host, OnInit, Self, ViewContainerRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';
import { SideButtonComponent } from './side-button.component';

/** adds close/open button to mat-drawer */
@Directive({
  selector: 'mat-drawer[button]',
  standalone: true,
  providers: [DestroyService]
})
export class DrawerButtonDirective implements OnInit {

  constructor(
    private viewContainerRef: ViewContainerRef,
    @Host() @Self() private drawer: MatDrawer,
    private destroy$: DestroyService,
  ) { }


  ngOnInit(): void {
    const buttonRef = this.viewContainerRef.createComponent(SideButtonComponent);
    const chDetector = buttonRef.injector.get(ChangeDetectorRef);

    /** assumes drawer position 'end' */
    this.drawer.position = 'end';
    buttonRef.instance.opened = this.drawer.opened;
    buttonRef.instance.drawer = this.drawer;

    this.drawer.openedChange.pipe(
      takeUntil(this.destroy$),
    ).subscribe(st => {
      buttonRef.instance.opened = st;
      chDetector.markForCheck();
    });
  }

}
