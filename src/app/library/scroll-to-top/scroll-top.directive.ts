import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, ComponentRef, Directive, Host, OnInit, Output, Self, ViewContainerRef } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { debounceTime, filter, map, Observable, of, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { ScrollToTopComponent } from './scroll-to-top.component';

const showScrollHeight = 300;
const hideScrollHeight = 10;

const SCROLL_AUDIT_TIME = 200;

@Directive({
  selector: '[scroll-to-top]',
  exportAs: 'scrollToTop',
  providers: [DestroyService],
})
export class ScrollTopDirective implements OnInit {

  @Output('scrollToTopVisible') visible$: Observable<boolean> = of(false).pipe(
    switchMap(showScroll => this.scrollable.elementScrolled().pipe(
      debounceTime(SCROLL_AUDIT_TIME),
      map(() => this.scrollable.measureScrollOffset('top')),
      map(offset => !showScroll && offset > showScrollHeight || showScroll && offset > hideScrollHeight),
      filter(show => show !== showScroll),
      tap(show => showScroll = show),
      shareReplay(1),
    ))
  );

  visible = false;

  private componentRef: ComponentRef<ScrollToTopComponent> | null = null;
  private changeDetectorRef: ChangeDetectorRef;


  constructor(
    private container: ViewContainerRef,
    @Host() @Self() private scrollable: CdkScrollable,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {

    this.visible$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(show => this.setVisible(show));

  }

  private setVisible(show: boolean) {
    if (!this.componentRef) {
      this.componentRef = this.container.createComponent(ScrollToTopComponent);
      this.componentRef.instance.scrollable = this.scrollable;
      this.changeDetectorRef = this.componentRef.injector.get(ChangeDetectorRef);
    }
    this.componentRef.instance.visible = show;
    this.visible = show;
    this.changeDetectorRef.detectChanges();
  }

  scrollToTop() {
    this.scrollable.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
