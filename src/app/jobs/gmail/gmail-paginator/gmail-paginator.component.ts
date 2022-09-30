import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-gmail-paginator',
  templateUrl: './gmail-paginator.component.html',
  styleUrls: ['./gmail-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GmailPaginatorComponent {

  @Input() activePage = 0;

  private _pageSize = 100;
  @Input() set pageSize(value: NumberInput) {
    this._pageSize = coerceNumberProperty(value, 100);
  }
  get pageSize(): number {
    return this._pageSize;
  }

  @Input() lastPage: boolean = true;

  @Input() loadedCount = 0;

  @Output() indexChanges = new Subject<number>();

  get start(): number {
    return this.loadedCount ? this.activePage * this.pageSize + 1 : 0;
  }
  get end(): number {
    return this.loadedCount ? this.activePage * this.pageSize + this.loadedCount : 0;
  }

  setPage(idx: number): void {
    if (idx < 0) idx = 0;
    this.activePage = idx;
    this.indexChanges.next(this.activePage);
  }

  firstPage() {
    this.setPage(0);
  }

  nextPage() {
    if (this.lastPage) return;
    this.setPage(this.activePage + 1);
  }

  previousPage() {
    if (this.activePage === 0) return;
    this.setPage(this.activePage - 1);
  }


}
