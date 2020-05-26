import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobPartial } from 'src/app/interfaces';

const TABLE_COLUMNS = ['jobId', 'name', 'productName', 'count', 'price', 'total'];

@Component({
  selector: 'app-job-selection-table',
  templateUrl: './job-selection-table.component.html',
  styleUrls: ['./job-selection-table.component.css']
})
export class JobSelectionTableComponent implements OnInit, OnDestroy {
  @Input('jobs') set _jobs(jobs: JobPartial[]) {
    if (jobs !== null) {
      this.setNewJobList(jobs);
    }
  }
  @Input('disabled') set _disabled(disabled: boolean) {
    this.displayedColumns = disabled === false ? this.columnsWithSelection() : TABLE_COLUMNS;
  }
  @Output() selected = new EventEmitter<number[]>();

  selector = new SelectionModel<number>(true, []);
  private readonly _subscription = new Subscription();
  jobIdSet: Set<number> = new Set();

  constructor() { }

  displayedColumns: string[] = this.columnsWithSelection();
  jobs$: BehaviorSubject<JobPartial[]> = new BehaviorSubject([]);

  ngOnInit(): void {
    const subs = this.selector.changed.pipe(
      map(() => this.selector.selected),
    ).subscribe(this.selected);
    this._subscription.add(subs);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  isAllSelected(): boolean {
    return this.selector.selected.length === this.jobIdSet.size;
  }

  toggleAll() {
    this.isAllSelected() ? this.selector.clear() : this.selectAll(...this.jobIdSet);
  }

  selectAll(...jobs: number[]): void {
    this.selector.select(...jobs);
  }

  private setNewJobList(jobs: JobPartial[]): void {
    this.selector.clear();
    this.jobs$.next(jobs);
    this.jobIdSet = new Set(jobs.map(job => job.jobId));
    this.selectAll(...this.jobIdSet);
  }

  private columnsWithSelection(): string[] {
    return ['selected'].concat(TABLE_COLUMNS);
  }

}
