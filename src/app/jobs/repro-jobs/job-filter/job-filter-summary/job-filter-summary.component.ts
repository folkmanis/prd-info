import { ChangeDetectorRef, Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JobFilterFormProvider } from '../job-filter.component';
import { JobState } from 'src/app/interfaces';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-job-filter-summary',
  templateUrl: './job-filter-summary.component.html',
  styleUrls: ['./job-filter-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFilterSummaryComponent implements OnInit, OnDestroy, JobFilterFormProvider {

  private subs: Subscription | null;

  @Input() jobStates: JobState[] = [];

  filterForm: FormGroup;

  get jobStatusStr(): string {
    return (this.filterForm.get('jobStatus').value as number[])
      .map(st => this.jobStates.find(val => val.state === st)?.description)
      .join(', ');
  }

  constructor(
    public filterProvider: JobFilterFormProvider,
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
