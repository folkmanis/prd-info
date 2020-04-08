import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { map, filter, switchMap, tap, startWith, debounceTime } from 'rxjs/operators';
import { merge, Observable, Subscription, pipe } from 'rxjs/index';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveRecord, SearchQuery } from '../services/archive-search-class';
import { SearchData } from './search-data';

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
  search = '';
  subs = new Subscription();
  data = new SearchData(this.service);
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
  // Scroll parametri
  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;

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
