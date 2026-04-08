import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  untracked,
} from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CustomerPartial } from 'src/app/interfaces';
import { AutocompleteFilterDirective } from 'src/app/library/autocomplete';
import { DateRangePickerComponent } from 'src/app/library/date-range-picker';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { JobsProductionQuery } from '../../interfaces';
import { ProductsFilterSummaryComponent } from '../products-filter-summary/products-filter-summary.component';

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
    start: Date | null;
    end: Date | null;
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
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    ViewSizeDirective,
    MatExpansionModule,
    ProductsFilterSummaryComponent,
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
export class ProductsFilterComponent {
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
}
