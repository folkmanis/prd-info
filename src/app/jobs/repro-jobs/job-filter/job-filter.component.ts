import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, debounceTime, filter, map } from 'rxjs';
import { ProductPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { ViewSizeModule } from '../../../library/view-size/view-size.module';
import { DEFAULT_FILTER, JobFilter, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';

export type FilterFormType = {
  [k in keyof JobFilter]: FormControl<JobFilter[k]>;
};

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    ViewSizeModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe,
  ],
})
export class JobFilterComponent {
  jobStates$ = getConfig('jobs', 'jobStates');

  filterForm: FormGroup<FilterFormType> = this.fb.group({
    name: [null],
    jobsId: ['', [Validators.pattern(/^[0-9]+$/)]],
    customer: [''],
    jobStatus: [[] as number[]],
    productsName: [null],
  });

  private customers = toSignal(inject(CustomersService).getCustomerList(), {
    initialValue: [],
  });
  private customerControlValue = toSignal(
    this.filterForm.controls.customer.valueChanges
  );
  customersFiltered = computed(() => {
    const input = this.customerControlValue()?.toUpperCase() || '';
    return this.customers().filter((c) =>
      c.CustomerName.toUpperCase().includes(input)
    );
  });

  @Input()
  set filter(value: JobQueryFilter) {
    this.filterForm.reset(undefined, { emitEvent: false });
    if (value instanceof JobQueryFilter) {
      this.filterForm.patchValue(value.jobListFilter(), { emitEvent: false });
    }
  }
  get filter() {
    return this.jobService.normalizeFilter(this.filterForm.value);
  }

  @Input() products: ProductPartial[] | null = null;

  @Output() filterChanges: Observable<JobQueryFilter> =
    this.filterForm.valueChanges.pipe(
      filter((_) => this.filterForm.valid),
      debounceTime(300),
      map(() => this.filter)
    );

  constructor(private jobService: JobService, private fb: FormBuilder) {}

  onReset<T extends keyof JobFilter>(key?: T) {
    if (key) {
      this.filterForm.controls[key].reset(DEFAULT_FILTER[key]);
    } else {
      this.filterForm.reset(DEFAULT_FILTER);
    }
  }
}
