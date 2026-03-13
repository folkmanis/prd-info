import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { formatISO, parseISO, startOfMonth } from 'date-fns';
import { isEqual } from 'lodash-es';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { JobsProductionFilterQuery, JobsProductionQuery } from '../../interfaces';
import { DateRangePickerComponent, NullableInterval } from 'src/app/library/date-range-picker';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomerPartial } from 'src/app/interfaces';
import { MatInput } from '@angular/material/input';
import { disabled, form, FormField } from '@angular/forms/signals';
import { AutocompleteFilterDirective } from 'src/app/library/autocomplete';

export const REPRO_DEFAULTS = {
  jobStatus: [10, 20],
  category: ['repro'],
};

export type JobsProductionFilter = Pick<
  JobsProductionQuery,
  'category' | 'customer' | 'fromDate' | 'toDate' | 'jobStatus'
>;

interface FilterModel {
  jobStatus: number[];
  category: string[];
  customer: string;
  interval: {
    start: Date;
    end: Date;
  };
}

function filterToModel(filter: JobsProductionFilter): FilterModel {
  return {
    jobStatus: filter.jobStatus,
    category: filter.category,
    customer: filter.customer ?? '',
    interval: {
      start: filter.fromDate,
      end: filter.toDate,
    },
  };
}

function modelToFilter(model: FilterModel): JobsProductionFilter {
  return {
    fromDate: model.interval.start,
    toDate: model.interval.end,
    jobStatus: model.jobStatus,
    category: model.category,
    customer: model.customer || null,
  };
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    ViewSizeDirective,
    MatExpansionModule,
    FilterSummaryComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DateRangePickerComponent,
    MatAutocompleteModule,
    MatInput,
    AutocompleteFilterDirective,
  ],
})
export class FilterComponent {
  filter = model.required<JobsProductionFilter>();

  jobStates = configuration('jobs', 'jobStates');

  categories = configuration('jobs', 'productCategories');

  customers = input<CustomerPartial[] | null>();
  protected customerNames = computed(() => this.customers()?.map((c) => c.CustomerName));

  disabled = input(false);

  #filterModel = linkedSignal(() => untracked(() => filterToModel(this.filter())));
  protected filterForm = form(this.#filterModel, (s) => {
    disabled(s.customer, () => !this.customerNames());

    disabled(s, () => this.disabled());
  });

  constructor() {
    effect(() => {
      if (this.filterForm().valid()) {
        this.filter.set(modelToFilter(this.filterForm().value()));
      }
    });
  }

  protected onSetRepro() {
    this.#filterModel.update((m) => ({ ...m, ...REPRO_DEFAULTS }));
  }

  /* 
  jobStatus = signal<number[]>([10, 20], { equal: isEqual });
  category = signal<string[]>(['repro'], { equal: isEqual });
  interval = signal<{ start: Date | null; end: Date | null }>(
    {
      start: null,
      end: null,
    },
    { equal: isEqual },
  );
  customer = model<string>('');

  query = computed<JobsProductionFilterQuery>(() => {
    const fromDate = this.interval().start;
    const toDate = this.interval().end;
    const jobStatus = this.jobStatus();
    const category = this.category();
    const customer = this.customer();
    return {
      fromDate: fromDate && formatISO(fromDate, { representation: 'date' }),
      toDate: toDate && formatISO(toDate, { representation: 'date' }),
      jobStatus: jobStatus.length > 0 ? jobStatus : null,
      category: category.length > 0 ? category : null,
      customer,
    };
  });

  filterChange = output<JobsProductionFilterQuery>();

  onChangeJobStatus(value: number[]) {
    this.jobStatus.set(value);
    this.filterChange.emit(this.query());
  }

  onChangeCategory(value: string[]) {
    this.category.set(value);
    this.filterChange.emit(this.query());
  }


  setInterval({ start, end }: NullableInterval) {
    this.interval.set({
      start: start,
      end: end,
    });
    this.filterChange.emit(this.query());
  }

  private writeValue(value: JobsProductionFilterQuery | null): void {
    if (value) {
      const { fromDate, toDate, jobStatus, category, customer } = value;
      this.#filterModel.set({
        jobStatus: jobStatus || [],
        category: category || [],
        customer: customer ?? '',
        interval: {
          start: fromDate ? parseISO(fromDate) : new Date(),
          end: toDate ? parseISO(toDate) : new Date(),
        },
      });
      // this.jobStatus.set(jobStatus || []);
      // this.category.set(category || []);
      // this.customer.set(customer ?? '');
      // this.interval.set({
      //   start: fromDate ? parseISO(fromDate) : null,
      //   end: toDate ? parseISO(toDate) : null,
      // });
    }
  } */
}
