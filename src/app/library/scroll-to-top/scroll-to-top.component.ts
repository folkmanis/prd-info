import { Component, Input, OnInit, OnDestroy, NgZone, ElementRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

const showScrollHeight = 300;
const hideScrollHeight = 10;

const SCROLL_AUDIT_TIME = 500;

@Component({
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit, OnDestroy {

  scrollable: CdkScrollable;

  fixed: 'fixed' | null = null;

  private readonly _subs = new Subscription();

  showScroll = false;

  constructor(
    private zone: NgZone,
    private dispatcher: ScrollDispatcher,
    private chgRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log(this.fixed);
    const sub = this.dispatcher.scrolled(SCROLL_AUDIT_TIME).pipe(
      map(() => this.scrollable.measureScrollOffset('top')),
      tap(top => {
        if (top > showScrollHeight) {
          this.zone.run(() => this.setVisibility(true)); // Scroll tiek pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs
        } else if (this.showScroll && top < hideScrollHeight) {
          this.zone.run(() => this.setVisibility(false));
        }
      }),
    ).subscribe();

    this._subs.add(sub);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  scrollToTop() {
    this.scrollable.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setVisibility(status: boolean): void {
    this.showScroll = status;
    this.chgRef.markForCheck();
  }

}
