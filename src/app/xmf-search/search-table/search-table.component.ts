import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { SearchQuery } from 'src/app/interfaces/xmf-search';
import { ArchiveSearchService } from '../services/archive-search.service';
import { SearchData } from './search-data';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class SearchTableComponent implements OnInit {
  @ViewChild(CdkScrollable, { static: true }) content: CdkScrollable;

  constructor(
    private service: ArchiveSearchService,
    private destroy$: DestroyService,
  ) { }

  query: SearchQuery;
  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];
  search = '';
  data = new SearchData(this.service);

  ngOnInit() {
    this.service.searchString$.pipe(takeUntil(this.destroy$))
      .subscribe(s => this.search = s);
    this.service.searchResult$.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.content.scrollTo({ top: 0 }));
  }

}
