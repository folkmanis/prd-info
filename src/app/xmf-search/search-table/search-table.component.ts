import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';
import { ArchiveSearchService } from '../services/archive-search.service';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class SearchTableComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport)
  content: CdkVirtualScrollViewport;

  @Input() search: string | undefined;

  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];

  data$ = this.service.archive$;

  constructor(
    private service: ArchiveSearchService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit() {
    this.service.count$.pipe(
      takeUntil(this.destroy$)
    )
      .subscribe(() => this.scrollToTop());
  }

  private scrollToTop() {
    this.content?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
