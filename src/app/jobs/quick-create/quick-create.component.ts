import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { JobFilter } from '../interfaces';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { JobsTableComponent } from './jobs-table/jobs-table.component';
import { QuickCreateInputComponent } from './quick-create-input/quick-create-input.component';
import { QuickCreateService } from './quick-create.service';
import { isEqual } from 'lodash-es';

const DEFAULT_FILTER = { limit: 100, jobStatus: [30] };

@Component({
  selector: 'app-quick-create',
  imports: [QuickCreateInputComponent, JobsTableComponent],
  templateUrl: './quick-create.component.html',
  styleUrl: './quick-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ScrollTopDirective],
})
export class QuickCreateComponent {
  #preferences = inject(JobsUserPreferencesService).userPreferences;
  #filter = linkedSignal<JobFilter | undefined>(
    () => {
      const customer = this.initialJob()?.customerName;
      if (customer) {
        return { ...DEFAULT_FILTER, customer };
      } else {
        return undefined;
      }
    },
    { equal: isEqual },
  );

  protected jobs = inject(QuickCreateService).jobsResource(this.#filter);

  products = input.required<ProductPartial[]>();
  customers = input.required<CustomerPartial[]>();

  initialJob = computed(() => this.#preferences()?.quickCreateJob);

  onSetCustomer(customer: string | undefined | null) {
    if (customer) {
      this.#filter.update((f) => (f ? { ...f, customer } : { ...DEFAULT_FILTER, customer }));
    } else {
      this.#filter.set(undefined);
    }
  }

  onReload() {
    this.jobs.reload();
  }
}
