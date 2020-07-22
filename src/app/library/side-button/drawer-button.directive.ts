import { Directive, Host, Self, OnInit, OnDestroy, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Subscription } from 'rxjs';
import { SideButtonComponent } from './side-button.component';
import { MatDrawer } from '@angular/material/sidenav';

/** adds close/open button to mat-drawer */
@Directive({
  selector: '[appDrawerButton], mat-drawer[button]'
})
export class DrawerButtonDirective implements OnInit, OnDestroy {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Host() @Self() private drawer: MatDrawer,
  ) { }

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(SideButtonComponent);
    const buttonRef = this.viewContainerRef.createComponent(factory);

    /** assumes drawer position 'end' */
    this.drawer.position = 'end';
    buttonRef.instance.opened = this.drawer.opened;
    this._subs.add(
      buttonRef.instance.clicks.subscribe(() => this.drawer.toggle())
    );
    this._subs.add(
      this.drawer.openedChange.subscribe((st: boolean) => buttonRef.instance.opened = st)
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

}
