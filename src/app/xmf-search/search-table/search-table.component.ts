import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { map, filter, switchMap, tap, startWith, debounceTime } from 'rxjs/operators';
import { merge, Observable, Subscription, pipe } from 'rxjs/index';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveRecord, SearchQuery } from '../services/archive-search-class';
import { SearchData } from './search-data';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTableComponent implements OnInit, OnDestroy {
  @ViewChild(CdkScrollable, { static: true }) content: CdkScrollable;

  constructor(
    private snack: MatSnackBar,
    private service: ArchiveSearchService,
  ) { }

  query: SearchQuery;
  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];
  search = '';
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

}
