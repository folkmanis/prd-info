import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, filter, map } from 'rxjs';
import { ProductPartial } from 'src/app/interfaces';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { CustomersService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { JobFilter } from '../../interfaces';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';

export interface JobFilterSelections {
  customer: string;
  jobsId: string;
  name: string;
  productsName: string;
  jobStatus: number[];
}

export type FilterFormType = {
  [k in keyof JobFilterSelections]: FormControl<JobFilterSelections[k] | null>;
};

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    ViewSizeDirective,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    CustomerInputComponent,
    FilterSummaryComponent,
  ],
})
export class JobFilterComponent {
  filterForm: FormGroup<FilterFormType> = inject(FormBuilder).group({
    name: [null as string | null],
    jobsId: ['', [Validators.pattern(/^[0-9]+$/)]],
    customer: [''],
    jobStatus: [[] as number[]],
    productsName: [null as string | null],
  });

  customers = inject(CustomersService).getCustomersResource({ disabled: false }).asReadonly();
  jobStates = configuration('jobs', 'jobStates');
  products = input<ProductPartial[] | null>(null);

  filter = input.required<JobFilter>();

  #filterChange$ = this.filterForm.events.pipe(
    filter((event) => event instanceof ValueChangeEvent && event.source.valid),
    debounceTime(300),
    map((event: ValueChangeEvent<FilterFormType>) => this.#applyFilterChanges(event.value)),
  );
  filterChange = outputFromObservable(this.#filterChange$);

  constructor() {
    effect(() => {
      const queryFilter = this.#toJobsFilterOptions(this.filter());
      untracked(() => {
        this.filterForm.reset(queryFilter, { emitEvent: false });
      });
    });
  }

  onReset<T extends keyof JobFilterSelections>(key?: T) {
    if (key) {
      this.filterForm.controls[key].reset(this.#defaultFilter[key]);
    } else {
      this.filterForm.reset(this.#defaultFilter);
    }
  }

  #applyFilterChanges(value: Record<string, any>): JobFilter {
    return {
      ...this.filter(),
      customer: value.customer ? value.customer : undefined,
      jobsId: value.jobsId ? [+value.jobsId] : undefined,
      name: value.name ? value.name : undefined,
      productsName: value.productsName ? value.productsName : undefined,
      jobStatus: value.jobStatus,
    };
  }

  #toJobsFilterOptions(jobFilter: JobFilter): JobFilterSelections {
    const { customer, jobsId, name, productsName, jobStatus } = jobFilter;
    return {
      customer: customer ?? '',
      jobsId: jobsId ? jobsId.join(',') : '',
      name: name || '',
      productsName: productsName || '',
      jobStatus: jobStatus || [],
    };
  }

  #defaultFilter: JobFilterSelections = {
    customer: '',
    jobsId: '',
    name: '',
    productsName: '',
    jobStatus: [10, 20],
  };
}
