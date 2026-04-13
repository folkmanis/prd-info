import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { configuration } from 'src/app/services/config.provider';
import { JobFilter } from '../../interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-job-list-filter-summary',
  imports: [DatePipe],
  templateUrl: './job-list-filter-summary.component.html',
  styleUrl: './job-list-filter-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListFilterSummaryComponent {
  #jobStates = configuration('jobs', 'jobStates');

  filter = input.required<JobFilter>();

  protected filterIsSet = computed(() => Object.keys(this.filter()).length > 0);

  protected jobsId = computed(() => this.filter().jobsId?.join(', '));

  selectedStates = computed(() => {
    const jobStates = this.#jobStates();
    return this.filter()
      .jobStatus?.map((js) => jobStates.find((s) => s.state === js)?.description ?? '')
      .join(', ');
  });
}
