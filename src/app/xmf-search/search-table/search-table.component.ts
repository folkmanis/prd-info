import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyClipboardDirective } from 'src/app/library/directives/copy-clipboard.directive';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { TaggedStringComponent } from 'src/app/library/tagged-string/tagged-string.component';
import { SearchQuery } from '../interfaces';
import { SearchData } from '../services/search-data';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ScrollTopDirective,
    CdkVirtualForOf,
    TaggedStringComponent,
    CopyClipboardDirective,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
})
export class SearchTableComponent {
  @ViewChild(CdkVirtualScrollViewport)
  private content: CdkVirtualScrollViewport;

  @Input() search: SearchQuery | null;

  private _data: SearchData | null;
  @Input() set data(value: SearchData | null) {
    this._data = value;
    this.scrollToTop();
  }
  get data() {
    return this._data;
  }

  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];

  private scrollToTop() {
    this.content?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
