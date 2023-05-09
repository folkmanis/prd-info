import { Directionality } from '@angular/cdk/bidi';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, ComponentRef, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';
import { ScrollToTopComponent } from './scroll-to-top.component';


@Directive({
  selector: '[scroll-to-top]',
  standalone: true,
  exportAs: 'scrollToTop',
  providers: [
    DestroyService,
    { provide: CdkScrollable, useExisting: ScrollTopDirective }
  ],
})
export class ScrollTopDirective extends CdkScrollable implements OnInit, AfterViewInit, OnDestroy {

  @Input() showScrollHeight = 300;

  @Input() hideScrollHeight = 10;

  @Input() scrollAuditTime = 200;

  @Input('scrollToTopBottom') bottom = '20px';
  @Input('scrollToTopRight') right = '80px';

  @Output() scrollToTopVisible = new Subject<boolean>();

  set visible(value: boolean) {

    if (!this.componentRef) {
      this.createButtonComponent();
    }

    this.componentRef.instance.visible = value;

    this.ngZone.run(() => {
      this.scrollToTopVisible.next(value);
      this.buttonChangeDetectorRef.markForCheck();
    });

  }
  get visible(): boolean {
    return this.componentRef?.instance.visible || false;
  }

  private componentRef: ComponentRef<ScrollToTopComponent> | null = null;
  private buttonChangeDetectorRef: ChangeDetectorRef;

  constructor(
    private dispatcher: ScrollDispatcher,
    private container: ViewContainerRef,
    private destroy$: DestroyService,
    elementRef: ElementRef,
    ngZone: NgZone,
    @Optional() dir: Directionality,
  ) {
    super(elementRef, dispatcher, ngZone, dir);
  }

  ngOnInit(): void {
    this.dispatcher.register(this);
  }

  ngAfterViewInit(): void {

    this.dispatcher.ancestorScrolled(this.elementRef, this.scrollAuditTime).pipe(
      map(() => this.measureScrollOffset('top')),
      map(offset => !this.visible && offset > this.showScrollHeight || this.visible && offset > this.hideScrollHeight),
      filter(show => show !== this.visible),
      tap(show => this.visible = show),
      takeUntil(this.destroy$),
    )
      .subscribe(this.scrollToTopVisible);
  }

  ngOnDestroy(): void {
    this.dispatcher.deregister(this);
  }

  scrollToTop() {
    this.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private createButtonComponent() {
    this.componentRef = this.container.createComponent(ScrollToTopComponent);
    this.componentRef.instance.scrollable = this;
    this.componentRef.instance.bottom = this.bottom;
    this.componentRef.instance.right = this.right;
    this.buttonChangeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
  }

}
