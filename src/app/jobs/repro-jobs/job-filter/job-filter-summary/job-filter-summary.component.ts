import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { JobState } from 'src/app/interfaces';
import { JobFilterFormProvider } from '../job-filter.component';

@Component({
  selector: 'app-job-filter-summary',
  templateUrl: './job-filter-summary.component.html',
  styleUrls: ['./job-filter-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFilterSummaryComponent implements OnInit, OnDestroy, JobFilterFormProvider {

  private subs: Subscription | null;

  @Input() jobStates: JobState[] = [];

  filterForm: JobFilterFormProvider['filterForm'];

  get jobStatusStr(): string {
    return (this.filterForm.get('jobStatus').value as number[])
      .map(st => this.jobStates.find(val => val.state === st)?.description)
      .join(', ');
  }

  constructor(
    filterProvider: JobFilterFormProvider,
    private chd: ChangeDetectorRef,
  ) {
    this.filterForm = filterProvider.filterForm;
  }

  ngOnInit(): void {
    this.subs = merge(
      this.filterForm.valueChanges,
      this.filterForm.statusChanges,
    ).subscribe(() => this.chd.markForCheck());
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}
