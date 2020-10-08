import { Directive, OnInit, Host, Self, ComponentFactoryResolver, ViewContainerRef, Input, ComponentRef, Attribute } from '@angular/core';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollToTopComponent } from './scroll-to-top.component';

@Directive({
  selector: '[appScrollTop], [cdk-scrollable], [scroll-to-top]'
})
export class ScrollTopDirective implements OnInit {

  private _componentRef: ComponentRef<ScrollToTopComponent> | undefined;

  @Input() buttonPositionFixed: any;

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
