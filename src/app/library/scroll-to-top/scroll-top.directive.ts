import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, Host, OnInit, Self, ViewContainerRef } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { of } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScrollToTopComponent } from './scroll-to-top.component';

const showScrollHeight = 300;
const hideScrollHeight = 10;

const SCROLL_AUDIT_TIME = 200;

@Directive({
  selector: '[scroll-to-top]',
  providers: [DestroyService],
})
export class ScrollTopDirective implements OnInit {

  private factory = this.resolver.resolveComponentFactory(ScrollToTopComponent);
  private componentRef: ComponentRef<ScrollToTopComponent> | null = null;
  private changeDetectorRef: ChangeDetectorRef;


  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    @Host() @Self() private scrollable: CdkScrollable,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {

    of(false).pipe(
      switchMap(showScroll => this.scrollable.elementScrolled().pipe(
        debounceTime(SCROLL_AUDIT_TIME),
        map(() => this.scrollable.measureScrollOffset('top')),
        map(offset => !showScroll && offset > showScrollHeight || showScroll && offset > hideScrollHeight),
        filter(show => show !== showScroll),
        tap(show => showScroll = show),
        takeUntil(this.destroy$),
      )),
    ).subscribe(show => this.setVisible(show));

  }

  private setVisible(show: boolean) {
    if (!this.componentRef) {
      this.componentRef = this.container.createComponent(this.factory);
      this.componentRef.instance.scrollable = this.scrollable;
      this.changeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
    }
    this.componentRef.instance.visible = show;
    this.changeDetectorRef.detectChanges();
  }

  scrollToTop() {
    this.scrollable.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
