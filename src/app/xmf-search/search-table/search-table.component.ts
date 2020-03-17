import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { map, filter, switchMap, tap, startWith } from 'rxjs/operators';
import { merge, Observable, Subscription, pipe } from 'rxjs/index';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveRecord, SearchQuery } from '../services/archive-search-class';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CdkScrollable, { static: true }) content: CdkScrollable;

  constructor(
    private snack: MatSnackBar,
    private service: ArchiveSearchService,
    private zone: NgZone,
  ) { }

  query: SearchQuery;
  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];
  search: string = '';
  subs = new Subscription();
  data = new SearchData(this.service);

  ngOnInit() {
    this.subs.add(
      this.service.searchString$.subscribe(s => this.search = s)
    );
    this.subs.add(
      this.service.searchResult$.subscribe(() => this.content.scrollTo({ top: 0 }))
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onCopied(val: string) {
    this.snack.open('Pārkopēts starpliktuvē: ' + val, 'OK', { duration: 3000 });
  }

  statuss$: Observable<string> = this.service.count$.pipe(
    map(count => {
      if (!count || count < 1) {
        return 'Nav rezultātu';
      } else {
        const si = (count % 10 === 1 && count !== 11 ? 's' : 'i');
        return `Atrast${si} ${count} ierakst${si}`;
      }
    })
  );

  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;
  ngAfterViewInit() {
    this.content.elementScrolled().pipe(
      map(() => this.content.measureScrollOffset('top')),
      tap(top => {
        if (top > this.showScrollHeight) {
          this.zone.run(() => this.showScroll = true); // Scroll tiek pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs
        } else if (this.showScroll && top < this.hideScrollHeight) {
          this.zone.run(() => this.showScroll = false);
        }
      }),
    ).subscribe();
  }

  scrollToTop() {
    this.content.scrollTo({ top: 0 });
  }

}

class SearchData extends DataSource<ArchiveRecord | undefined> {
  constructor(private service: ArchiveSearchService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(ArchiveRecord | undefined)[]> {
    const range$ = collectionViewer.viewChange.pipe(
      startWith({ start: 0, end: 99 }),
    );
    return this.service.rangedData(range$);
  }

  disconnect() {
  }
}