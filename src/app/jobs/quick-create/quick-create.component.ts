import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { JobFilter } from '../interfaces';
import { QuickCreateJob } from '../interfaces/jobs-user-preferences';
import { JobsTableComponent } from './jobs-table/jobs-table.component';
import { QuickCreateInputComponent } from './quick-create-input/quick-create-input.component';
import { QuickCreateService } from './quick-create.service';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';

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
  #filter = linkedSignal<JobFilter | undefined>(() =>
    this.initialJob().customerName ? { ...DEFAULT_FILTER, customer: this.initialJob().customerName } : undefined,
  );

  protected jobs = inject(QuickCreateService).jobsResource(this.#filter);

  products = input.required<ProductPartial[]>();
  customers = input.required<CustomerPartial[]>();

  initialJob = input.required<QuickCreateJob>();

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
