import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JobUnwindedPartial } from 'src/app/jobs';

const TABLE_COLUMNS = ['selected', 'jobId', 'receivedDate', 'custCode', 'name', 'productName', 'count', 'price', 'total'];

@Component({
  selector: 'app-job-selection-table',
  standalone: true,
  templateUrl: './job-selection-table.component.html',
  styleUrls: ['./job-selection-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatCheckboxModule, DatePipe, RouterLink, CurrencyPipe],
})
export class JobSelectionTableComponent implements OnInit, OnDestroy {
  jobs$ = new BehaviorSubject<JobUnwindedPartial[]>([]);

  selector = new SelectionModel<number>(true, [], false);
  jobIdSet = new Set<number>();
  displayedColumns = TABLE_COLUMNS;

  isNumber = (value: any) => !isNaN(value);

  @Input() set jobs(value: JobUnwindedPartial[]) {
    value = value || [];
    this.jobs$.next(value);
    this.selector.clear();
    this.jobIdSet = new Set(value.map((job) => job.jobId));
  }

  private _disabled = false;
  @Input() set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this.setDisplayedColumns();
  }
  get disabled() {
    return this._disabled;
  }

  private _large = false;
  @Input() set large(value: any) {
    this._large = coerceBooleanProperty(value);
    this.setDisplayedColumns();
  }
  get large() {
    return this._large;
  }

  @Input() set selected(value: JobUnwindedPartial[]) {
    value = value || [];
    this.selector.select(...value.map((job) => job.jobId));
  }
  get selected() {
    const jobs = this.jobs$.value;
    const sel = this.selector.selected;
    return jobs.filter((job) => sel.some((num) => num === job.jobId));
  }

  @Input() total?: number;

  @Output() selectedChange = new EventEmitter<JobUnwindedPartial[]>();

  ngOnInit(): void {
    this.setDisplayedColumns();
  }

  ngOnDestroy() {
    this.selectedChange.complete();
    this.jobs$.complete();
  }

  isAllSelected(): boolean {
    return this.jobIdSet?.size > 0 && this.selector.selected.length === this.jobIdSet.size;
  }

  toggle(jobId: number) {
    this.selector.toggle(jobId);
    this.selectedChange.next(this.selected);
  }

  toggleAll() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll();
  }

  selectAll(): void {
    this.selector.select(...this.jobIdSet);
    this.selectedChange.next(this.selected);
  }

  deselectAll(): void {
    this.selector.clear();
    this.selectedChange.next(this.selected);
  }

  private setDisplayedColumns() {
    const cols = this.disabled ? TABLE_COLUMNS.filter((col) => col !== 'selected') : TABLE_COLUMNS;
    this.displayedColumns = this.large ? cols : cols.filter((col) => ['selected', 'jobId', 'customer', 'name', 'total'].includes(col));
  }
}
