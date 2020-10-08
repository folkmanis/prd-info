import { Component, Input, OnInit, OnDestroy, NgZone, ElementRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

const showScrollHeight = 300;
const hideScrollHeight = 10;

const SCROLL_AUDIT_TIME = 200;

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
    const sub = this.dispatcher.scrolled(SCROLL_AUDIT_TIME).pipe(
      map(() => this.scrollable.measureScrollOffset('top')),
    ).subscribe(top => {
      if (!this.showScroll && top > showScrollHeight) {
        /** Scroll tiek pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs */
        this.zone.run(() => {
          this.showScroll = true;
          this.chgRef.markForCheck();
        });
      } else if (this.showScroll && top < hideScrollHeight) {
        /** Scroll tiek pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs */
        this.zone.run(() => {
          this.showScroll = false;
          this.chgRef.markForCheck();
        });
      }
    });

    this._subs.add(sub);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  scrollToTop() {
    this.scrollable.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
