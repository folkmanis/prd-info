import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, effect, input, viewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ArchiveRecord } from '../interfaces';
import { SearchDataSource } from '../services/search-data';
import { ArchiveRecordComponent } from './archive-record/archive-record.component';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ScrollTopDirective,
    CdkVirtualForOf,
    MatProgressSpinnerModule,
    ArchiveRecordComponent,
  ],
})
export class SearchTableComponent {
  private content = viewChild(CdkVirtualScrollViewport);

  searchString = input('');

  data = input<SearchDataSource<ArchiveRecord> | null>(null);

  constructor() {
    effect(() => {
      if (this.data()) {
        this.content()?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
