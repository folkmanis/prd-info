import { Component, computed, effect, input, linkedSignal, model, untracked } from '@angular/core';
import { debounce, disabled, form, FormField } from '@angular/forms/signals';
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
import { endOfDay, startOfDay } from 'date-fns';
import { isEqual } from 'lodash-es';
import { CustomerList } from 'src/app/interfaces';
import { pickNotNull } from 'src/app/library';
import { AutocompleteFilterDirective } from 'src/app/library/autocomplete';
import { DateRangePickerComponent } from 'src/app/library/date-range-picker';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { z, ZodType } from 'zod';
import { JobsProductionFilter } from '../../interfaces';
import { ProductsFilterSummaryComponent } from '../products-filter-summary/products-filter-summary.component';

export const REPRO_DEFAULTS = {
  jobStatus: [10, 20],
  category: ['repro'],
};

const optionalNullableString = z.codec(z.string().optional(), z.string().nullable(), {
  decode: (str) => str ?? '',
  encode: (str) => str || undefined,
});

const notEmptyArray = <T>(schema: ZodType<T, T>) =>
  z.codec(z.array(schema).optional(), z.array(schema), {
    decode: (arr) => arr || [],
    encode: (arr) => (arr.length === 0 ? undefined : (arr as T[])),
  });

const nullableOptionalDate = z.codec(z.date().optional(), z.date().nullable(), {
  decode: (value) => value ?? null,
  encode: (value) => value ?? undefined,
});
const IntervalModelSchema = z.object({
  start: nullableOptionalDate,
  end: nullableOptionalDate,
});
const JobsProductionFilterModelSchema = z.codec(
  z
    .object({
      jobStatus: notEmptyArray(z.number()),
      category: notEmptyArray(z.string()),
      customer: z.string(),
      fromDate: z.date(),
      toDate: z.date(),
    })
    .partial(),
  z.object({
    jobStatus: z.array(z.number()).default([]),
    category: z.array(z.string()).default([]),
    customer: optionalNullableString,
    interval: IntervalModelSchema,
  }),
  {
    encode: ({ interval, ...rest }) => {
      const { start, end } = interval;
      const fromDate = start && startOfDay(start);
      const toDate = end && endOfDay(end);
      return { ...pickNotNull(rest), fromDate, toDate };
    },
    decode: ({ fromDate: start, toDate: end, ...rest }) => ({
      interval: {
        start,
        end,
      },
      ...rest,
    }),
  },
);
type FilterModel = z.infer<typeof JobsProductionFilterModelSchema>;
export type FilterUpdate = z.input<typeof JobsProductionFilterModelSchema>;

function filterToModel(filter: JobsProductionFilter): FilterModel {
  return JobsProductionFilterModelSchema.decode(filter);
}

function modelToFilter(filterModel: FilterModel): FilterUpdate {
  return JobsProductionFilterModelSchema.encode(filterModel);
}

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
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

  customers = input<CustomerList[] | null>();
  protected customerNames = computed(() => this.customers()?.map((c) => c.customerName));

  disabled = input(false);

  #filterModel = linkedSignal(() => untracked(() => filterToModel(this.filter())));
  protected filterForm = form(this.#filterModel, (s) => {
    disabled(s.customer, { when: () => !this.customerNames() });

    disabled(s, { when: () => this.disabled() });
    debounce(s, 300);
  });

  constructor() {
    effect(() => {
      const update = this.filterForm().value();
      const current = untracked(() => filterToModel(this.filter()));
      if (this.filterForm().valid() && isEqual(update, current) === false) {
        this.filter.set(modelToFilter(update));
      }
    });
  }

  protected onSetRepro() {
    this.#filterModel.update((m) => ({ ...m, ...REPRO_DEFAULTS }));
  }
}
