import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AppClassTransformerService } from 'src/app/library';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { CustomersService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { JobFilter, JobQueryFilter } from '../../interfaces';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';

export type FilterFormType = {
  [k in keyof JobFilter]: FormControl<JobFilter[k] | null>;
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
  private transformer = inject(AppClassTransformerService);

  filterForm: FormGroup<FilterFormType> = inject(FormBuilder).group({
    name: [null as string | null],
    jobsId: ['', [Validators.pattern(/^[0-9]+$/)]],
    customer: [''],
    jobStatus: [[] as number[]],
    productsName: [null as string | null],
  });

  customers = inject(CustomersService).getCustomersResource({ disabled: false }).asReadonly();
  jobStates = configuration('jobs', 'jobStates');

  filter = input.required<JobQueryFilter>();

  products = input<ProductPartial[] | null>(null);

  filterChange$: Observable<JobQueryFilter> = this.filterForm.valueChanges.pipe(
    filter((_) => this.filterForm.valid),
    debounceTime(300),
    map((value) => this.transformer.plainToInstance(JobQueryFilter, value)),
  );
  filterChange = outputFromObservable(this.filterChange$);

  constructor() {
    effect(() => {
      const queryFilter = this.filter().toPlain();
      untracked(() => {
        this.filterForm.reset(queryFilter, { emitEvent: false });
      });
    });
  }

  onReset<T extends keyof JobFilter>(key?: T) {
    const def = JobQueryFilter.default().toPlain();
    if (key) {
      this.filterForm.controls[key].reset(def[key]);
    } else {
      this.filterForm.reset(def);
    }
  }
}
