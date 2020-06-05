import { Component, Input, OnInit, OnDestroy, NgZone, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';

const showScrollHeight = 300;
const hideScrollHeight = 10;

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css']
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  @Input() scrollable: CdkScrollable;
  @Input() position: 'fixed' | 'absolute' = 'fixed';

  private readonly _subs = new Subscription();
  showScroll = false;
  private scrollContainers: CdkScrollable[];

  constructor(
    private zone: NgZone,
    private dispatcher: ScrollDispatcher,
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    if (this.scrollable instanceof CdkScrollable) {
      this.scrollContainers = [this.scrollable];
    } else {
      this.scrollContainers = this.dispatcher.getAncestorScrollContainers(this.element);
    }
    const sub = this.dispatcher.scrolled().pipe(
      map(() => this.scrollContainers.reduce((acc, scr) => acc += scr.measureScrollOffset('top'), 0)),
      tap(top => {
        if (top > showScrollHeight) {
          this.zone.run(() => this.showScroll = true); // Scroll tiek pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs
        } else if (this.showScroll && top < hideScrollHeight) {
          this.zone.run(() => this.showScroll = false);
        }
      }),
    ).subscribe();

    this._subs.add(sub);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  scrollToTop() {
    this.scrollContainers.forEach(scr => scr.scrollTo({ top: 0 }));
  }

}
