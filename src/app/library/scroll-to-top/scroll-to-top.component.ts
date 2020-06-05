import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkScrollable } from '@angular/cdk/scrolling';

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

  constructor(
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    const sub = this.scrollable.elementScrolled().pipe(
      map(() => this.scrollable.measureScrollOffset('top')),
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
    this.scrollable.scrollTo({ top: 0 });
  }

}
