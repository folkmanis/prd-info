import { ComponentFactoryResolver, ComponentRef, Directive, Host, Input, OnInit, Self, ViewContainerRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ScrollToTopComponent } from './scroll-to-top.component';

@Directive({
  selector: '[appScrollTop], [cdk-scrollable], [scroll-to-top]'
})
export class ScrollTopDirective implements OnInit {
  /** Button style.position is set to 'fixed'. Default = 'absolute' */
  @Input() buttonPositionFixed: any;

  private _componentRef: ComponentRef<ScrollToTopComponent> | undefined;


  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    @Host() @Self() private scrollable: CdkScrollable,
  ) { }

  ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(ScrollToTopComponent);
    this._componentRef = this.container.createComponent(factory);
    this._componentRef.instance.scrollable = this.scrollable;
    this._componentRef.instance.fixed = (coerceBooleanProperty(this.buttonPositionFixed) && 'fixed') || null;
  }

}
