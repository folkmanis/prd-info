import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, ComponentRef, Directive, ElementRef, NgZone, Output, Input, ViewContainerRef } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { filter, map, Observable, shareReplay, takeUntil, tap } from 'rxjs';
import { ScrollToTopComponent } from './scroll-to-top.component';


@Directive({
  selector: '[scroll-to-top]',
  exportAs: 'scrollToTop',
  providers: [DestroyService],
})
export class ScrollTopDirective implements AfterViewInit {

  @Input() showScrollHeight = 300;

  @Input() hideScrollHeight = 10;

  @Input() scrollAuditTime = 200;


  @Output('scrollToTopVisible') visible$: Observable<boolean>;

  visible = false;

  private componentRef: ComponentRef<ScrollToTopComponent> | null = null;
  private buttonChangeDetectorRef: ChangeDetectorRef;

  private scrollable: CdkScrollable | void;

  constructor(
    private dispatcher: ScrollDispatcher,
    private container: ViewContainerRef,
    private destroy$: DestroyService,
    private elementRef: ElementRef,
    private ngZone: NgZone,
  ) { }

  ngAfterViewInit(): void {

    this.visible$ = this.dispatcher.ancestorScrolled(this.elementRef, this.scrollAuditTime).pipe(
      filter(scrollable => scrollable instanceof CdkScrollable),
      tap(scr => this.scrollable = scr),
      map(scr => scr && scr.measureScrollOffset('top')),
      map(offset => !this.visible && offset > this.showScrollHeight || this.visible && offset > this.hideScrollHeight),
      filter(show => show !== this.visible),
      tap(show => this.visible = show),
      shareReplay(1),
    );

    this.visible$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(show => this.setVisibility(show));

  }

  scrollToTop() {
    if (this.scrollable) {
      this.scrollable.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private setVisibility(show: boolean) {
    if (!this.componentRef && this.scrollable) {
      this.componentRef = this.container.createComponent(ScrollToTopComponent);
      this.componentRef.instance.scrollable = this.scrollable;
      this.buttonChangeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
    }
    this.componentRef.instance.visible = show;
    this.ngZone.run(() => {
      this.buttonChangeDetectorRef.markForCheck();
    });
  }

}
