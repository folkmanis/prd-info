import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { SearchQuery } from '../interfaces';
import { SearchData } from '../services/search-data';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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


  constructor(
  ) { }

  private scrollToTop() {
    this.content?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
