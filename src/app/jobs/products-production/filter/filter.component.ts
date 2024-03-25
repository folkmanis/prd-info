import { ChangeDetectionStrategy, Component, Input, OnInit, Output, effect, inject, input } from '@angular/core';
import { debounceTime, filter, interval, map, Observable, switchMap, tap } from 'rxjs';
import { configuration, getConfig } from 'src/app/services/config.provider';
import { JobsProductionFilterQuery } from '../../interfaces';
import { ProductsProductionFilterFormService, ProductsFormData } from './products-production-filter-form.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSizeModule } from '../../../library/view-size/view-size.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { isEqual, pick } from 'lodash-es';

export const REPRO_DEFAULTS: ProductsFormData = {
  jobStatus: [10, 20],
  category: ['repro'],
  fromDate: null,
  toDate: null,
};


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    ViewSizeModule,
    FormsModule,
    ReactiveFormsModule,
    FilterSummaryComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class FilterComponent {

  private formService = inject(ProductsProductionFilterFormService);

  form = this.formService.createForm();

  thisWeek = this.formService.thisWeekFn(this.form);
  thisYear = this.formService.thisYearFn(this.form);
  thisMonth = this.formService.thisMonthFn(this.form);
  pastYear = this.formService.pastYearFn(this.form);

  filter = input<JobsProductionFilterQuery | null>(null);

  filterChange$: Observable<JobsProductionFilterQuery> = this.form.valueChanges
    .pipe(
      map(value => this.formService.formToFilterQuery(value)),
      filter(value => this.isFilterChanged(value)),
      debounceTime(300),
      tap(value => console.log('filterChange$', value)),
    );

  filterChange = outputFromObservable(this.filterChange$);

  jobStates = configuration('jobs', 'jobStates');

  categories = configuration('jobs', 'productCategories');

  constructor() {
    effect(() => {
      const filter = this.filter();
      if (filter) {
        console.log('set filter', filter);
        this.form.setValue(
          this.formService.filterQueryToForm(filter),
          { emitEvent: false }
        );
      }
    }, { allowSignalWrites: true });
  }

  setRepro() {
    this.form.setValue(REPRO_DEFAULTS);
  }

  onReSetInterval() {
    this.formService.setInterval(this.form);
  }

  private isFilterChanged(value: any): boolean {
    const initialValue = pick(this.filter(), ['jobStatus', 'category', 'fromDate', 'toDate']);
    console.log(initialValue, value);
    return !isEqual(value, initialValue);
  }


}
