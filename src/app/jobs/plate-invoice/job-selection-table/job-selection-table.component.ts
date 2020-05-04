import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, tap, takeUntil, shareReplay } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { JobService, CustomersService } from '../../services';
import { CustomerPartial, JobPartial, JobProduct } from '../../interfaces';

@Component({
  selector: 'app-job-selection-table',
  templateUrl: './job-selection-table.component.html',
  styleUrls: ['./job-selection-table.component.css']
})
export class JobSelectionTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input('jobs') set _jobs(jobs: JobPartial[]) {
    this.selector.clear();
    this.jobs$.next(jobs);
    if (jobs?.length) {
      this.selector.select(...jobs);
    }
  }
  @Input() disabled: boolean;
  @Output() selected = new EventEmitter<JobPartial[]>();

  selector = new SelectionModel<JobPartial>(true, []);
  private readonly _unsubs = new Subject<void>();

  constructor() { }

  displayedColumns: string[] = ['selected', 'jobId', 'name'];
  jobs$: BehaviorSubject<JobPartial[]> = new BehaviorSubject([]);

  ngOnInit(): void {
    this.selector.changed.pipe(
      map(() => this.selector.selected), // map(job => job.jobId)),
      tap(sel => console.log('jobs selected', this.selector.selected)),
      takeUntil(this._unsubs),
    ).subscribe(this.selected);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this._unsubs.next();
  }

  isAllSelected(): boolean {
    return this.selector.selected.length === this.jobs$.value.length;
  }

  toggleAll() {
    this.isAllSelected() ? this.selector.clear() : this.selector.select(...this.jobs$.value);
  }

}
