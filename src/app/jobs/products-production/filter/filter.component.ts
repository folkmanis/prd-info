import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { interval, map, Observable, switchMap } from 'rxjs';
import { getConfig } from 'src/app/services/config.provider';
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
        NgFor,
        MatOptionModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        AsyncPipe,
    ],
})
export class FilterComponent implements OnInit {

  form = this.formService.createForm();

  thisWeek = this.formService.thisWeekFn(this.form);
  thisYear = this.formService.thisYearFn(this.form);
  thisMonth = this.formService.thisMonthFn(this.form);
  pastYear = this.formService.pastYearFn(this.form);


  @Output() filterChanges: Observable<JobsProductionFilterQuery> = interval(500).pipe(
    switchMap(() => this.form.valueChanges),
    map(value => this.formService.formToFilterQuery(value)),
  );


  @Input('filter')
  set filter(value: JobsProductionFilterQuery) {
    if (!value) {
      return;
    }
    this.form.setValue(
      this.formService.filterQueryToForm(value),
      { emitEvent: false }
    );
  }
  get filter(): JobsProductionFilterQuery {
    return this.formService.formToFilterQuery(this.form.value);
  }


  jobStates$ = getConfig('jobs', 'jobStates');

  categories$ = getConfig('jobs', 'productCategories');

  constructor(
    private formService: ProductsProductionFilterFormService,
  ) { }

  ngOnInit(): void {
  }

  setRepro() {
    this.form.setValue(REPRO_DEFAULTS);
  }

  onReSetInterval() {
    this.formService.setInterval(this.form);
  }


}
