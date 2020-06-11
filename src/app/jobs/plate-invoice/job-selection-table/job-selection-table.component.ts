import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { JobEditDialogService } from '../../services/job-edit-dialog.service';
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

  selector = new SelectionModel<number>(true, [], false);
  jobIdSet: Set<number> | undefined;

  constructor(
    private jobEditDialog: JobEditDialogService,
  ) { }

  displayedColumns: string[] = this.columnsWithSelection();
  jobs$: BehaviorSubject<JobPartial[]> = new BehaviorSubject([]);

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.selected.complete();
    this.jobs$.complete();
  }

  isAllSelected(): boolean {
    return this.jobIdSet && this.selector.selected.length === this.jobIdSet.size;
  }

  toggle(jobId: number) {
    this.selector.toggle(jobId);
    this.selected.next(this.selector.selected);
  }

  toggleAll() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll(...this.jobIdSet);
  }

  selectAll(...jobs: number[]): void {
    this.selector.select(...jobs);
    this.selected.next(this.selector.selected);
  }

  deselectAll(): void {
    this.selector.clear();
    this.selected.next(this.selector.selected);
  }

  onEditJob(jobId: number) {
    this.jobEditDialog.editJob(jobId);
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
