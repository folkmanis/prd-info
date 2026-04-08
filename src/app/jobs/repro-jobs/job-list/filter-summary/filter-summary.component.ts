import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { configuration } from 'src/app/services/config.provider';
import { JobFilter } from '../../../interfaces';

@Component({
  selector: 'app-filter-summary',
  imports: [],
  templateUrl: './filter-summary.component.html',
  styleUrl: './filter-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSummaryComponent {
  #jobStates = configuration('jobs', 'jobStates');

  filter = input.required<Pick<JobFilter, 'jobsId' | 'name' | 'customer' | 'productsName' | 'jobStatus'>>();

  protected jobsId = computed(() => this.filter().jobsId?.join(', '));

  selectedStates = computed(() => {
    const jobStates = this.#jobStates();
    return this.filter()
      .jobStatus?.map((js) => jobStates.find((s) => s.state === js)?.description ?? '')
      .join(', ');
  });
}
