import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, effect, input, viewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { SearchQuery } from '../interfaces';
import { SearchData } from '../services/search-data';
import { DataCardComponent } from './data-card/data-card.component';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, ScrollTopDirective, CdkVirtualForOf, MatProgressSpinnerModule, DataCardComponent],
})
export class SearchTableComponent {
  private content = viewChild(CdkVirtualScrollViewport);

  search = input<SearchQuery | null>(null);

  searchString = computed(() => this.search()?.q || '');

  data = input<SearchData | null>(null);

  constructor() {
    effect(() => {
      if (this.data()) {
        this.content()?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
