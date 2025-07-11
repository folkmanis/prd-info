import { Directive, ElementRef, Injector, ViewContainerRef, afterNextRender, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, auditTime, map } from 'rxjs';
import { ScrollToTopComponent } from './scroll-to-top.component';

@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[scroll-to-top]',
  exportAs: 'scrollToTop',
  host: {
    '(scroll)': 'onScroll($event)',
  },
})
export class ScrollTopDirective {
  private scrollAuditTime = 200;

  private elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

  private elementScrolled$ = new Subject<Event>();
  private offset$ = this.elementScrolled$.pipe(
    auditTime(this.scrollAuditTime),
    map(() => this.elementRef.nativeElement.scrollTop),
  );
  private offset = toSignal(this.offset$, { initialValue: 0 });

  private _visible = false;

  visible = computed(() => {
    const offset = this.offset();
    const startShowing = !this._visible && offset > this.showScrollHeight();
    const continueShowing = this._visible && offset > this.hideScrollHeight();
    this._visible = startShowing || continueShowing;
    return this._visible;
  });

  showScrollHeight = input(300);
  hideScrollHeight = input(10);

  bottom = input('20px', { alias: 'scrollToTopBottom' });
  right = input('80px', { alias: 'scrollToTopRight' });

  constructor() {
    const container = inject(ViewContainerRef);
    const injector = inject(Injector);

    afterNextRender(() => {
      container.createComponent(ScrollToTopComponent, { injector });
    });
  }

  scrollToTop() {
    this.elementRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onScroll(event: Event) {
    this.elementScrolled$.next(event);
  }
}
