import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { JobPartial, JobUnwindedPartial } from 'src/app/jobs';

const TABLE_COLUMNS = ['selected', 'jobId', 'receivedDate', 'customer', 'name', 'productName', 'count', 'price', 'total'];

@Component({
  selector: 'app-job-selection-table',
  templateUrl: './job-selection-table.component.html',
  styleUrls: ['./job-selection-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobSelectionTableComponent implements OnDestroy {

  @Input('jobs') set _jobs(jobs: JobUnwindedPartial[]) {
    if (jobs !== null) {
      this.setNewJobList(jobs);
    }
  }

  private _disabled = false;
  @Input() set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  get disabled() {
    return this._disabled;
  }

  selector = new SelectionModel<number>(true, [], false);
  jobIdSet: Set<number> | undefined;
  jobs$: BehaviorSubject<JobUnwindedPartial[]> = new BehaviorSubject([]);

  @Output() selectedJobs = new EventEmitter<JobUnwindedPartial[]>();


  get displayedColumns(): string[] {
    return this._disabled ? TABLE_COLUMNS.filter(col => col !== 'selected') : TABLE_COLUMNS;
  }

  constructor() { }


  ngOnDestroy() {
    this.selectedJobs.complete();
    this.jobs$.complete();
  }

  isAllSelected(): boolean {
    return this.jobIdSet && this.selector.selected.length === this.jobIdSet.size;
  }

  toggle(jobId: number) {
    this.selector.toggle(jobId);
    this.selectedJobs.next(this.getSelectedJobs());
  }

  toggleAll() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll(...this.jobIdSet);
  }

  selectAll(...jobs: number[]): void {
    this.selector.select(...jobs);
    this.selectedJobs.next(this.getSelectedJobs());
  }

  deselectAll(): void {
    this.selector.clear();
    this.selectedJobs.next(this.getSelectedJobs());
  }

  private setNewJobList(jobs: JobUnwindedPartial[]): void {
    this.selector.clear();
    this.jobs$.next(jobs);
    this.jobIdSet = new Set(jobs.map(job => job.jobId));
    this.selectAll(...this.jobIdSet);
  }

  private getSelectedJobs(): JobUnwindedPartial[] {
    const jobs = this.jobs$.value;
    const sel = this.selector.selected;
    return jobs.filter(job => sel.some(num => num === job.jobId));
  }

}
