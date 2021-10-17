import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, Input } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';
import { SearchQuery } from 'src/app/interfaces/xmf-search';
import { ArchiveSearchService } from '../services/archive-search.service';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class SearchTableComponent implements OnInit {

  @ViewChild(CdkScrollable) content: CdkScrollable;

  @Input() query: SearchQuery | undefined;

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
      .subscribe(() => this.content?.scrollTo({ top: 0 }));
  }

}
