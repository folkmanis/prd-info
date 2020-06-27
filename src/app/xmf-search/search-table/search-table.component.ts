import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SearchQuery } from '../services/archive-search-class';
import { ArchiveSearchService } from '../services/archive-search.service';
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

}
