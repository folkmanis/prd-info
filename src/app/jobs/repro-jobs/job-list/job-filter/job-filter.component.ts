import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  output,
  untracked,
} from '@angular/core';
import { debounce, form, FormField, pattern } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { isEqual } from 'lodash-es';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { AutocompleteFilterDirective } from 'src/app/library/autocomplete';
import { configuration } from 'src/app/services/config.provider';
import { JobFilter } from '../../../interfaces';
import { pickNotNull } from '../../../services/jobs-api.service';
import { DateRangePickerComponent } from 'src/app/library/date-range-picker';
import { ViewSizeDirective } from 'src/app/library/view-size';

export interface JobFilterModel {
  customer: string;
  jobsId: string;
  name: string;
  productsName: string;
  jobStatus: number[];
  interval: {
    start: Date | null;
    end: Date | null;
  };
}

const DEFAULT_FILTER_MODEL: JobFilterModel = {
  customer: '',
  jobsId: '',
  name: '',
  productsName: '',
  jobStatus: [10, 20],
  interval: {
    start: null,
    end: null,
  },
};

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    MatMiniFabButton,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatOption,
    AutocompleteFilterDirective,
    MatAutocompleteModule,
    DateRangePickerComponent,
    ViewSizeDirective,
  ],
})
export class JobFilterComponent {
  protected jobStates = configuration('jobs', 'jobStates');

  customers = input<CustomerPartial[] | null>();
  protected customerNames = computed(() => this.customers()?.map((c) => c.CustomerName) ?? []);

  products = input<ProductPartial[] | null>();
  protected productNames = computed(() => this.products()?.map((p) => p.name) ?? []);

  filter = input.required<JobFilter>();
  #filterModel = linkedSignal(() => this.#toModel(this.filter()), { equal: isEqual });
  protected filterForm = form(this.#filterModel, (s) => {
    pattern(s.jobsId, /^[0-9]+$/);
    debounce(s, 300);
  });

  filterChange = output<JobFilter>();

  constructor() {
    effect(() => {
      const filterUpdate = this.#fromModel(this.#filterModel());
      untracked(() => {
        if (!isEqual(filterUpdate, this.filter())) {
          this.filterChange.emit(filterUpdate);
        }
      });
    });
  }

  onReset<T extends keyof JobFilterModel>(key?: T) {
    if (key) {
      this.#filterModel.update((value) => ({ ...value, [key]: DEFAULT_FILTER_MODEL[key] }));
    } else {
      this.#filterModel.set(DEFAULT_FILTER_MODEL);
    }
  }

  #toModel(jobFilter: JobFilter): JobFilterModel {
    const { customer, jobsId, name, productsName, jobStatus } = jobFilter;
    const model = {
      customer: customer ?? '',
      jobsId: jobsId ? jobsId.join(',') : '',
      name: name || '',
      productsName: productsName || '',
      jobStatus: jobStatus || [],
      interval: {
        start: jobFilter.fromDate ?? null,
        end: jobFilter.toDate ?? null,
      },
    };
    return model;
  }

  #fromModel(model: JobFilterModel): JobFilter {
    return pickNotNull({
      customer: model.customer || undefined,
      jobsId: model.jobsId ? [+model.jobsId] : undefined,
      name: model.name || undefined,
      productsName: model.productsName || undefined,
      jobStatus: model.jobStatus,
      fromDate: model.interval.start || undefined,
      toDate: model.interval.end || undefined,
    });
  }
}
