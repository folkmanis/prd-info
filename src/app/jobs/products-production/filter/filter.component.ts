import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { interval, map, Observable, switchMap } from 'rxjs';
import { getConfig } from 'src/app/services/config.provider';
import { JobsProductionFilterQuery } from '../../interfaces';
import { FilterFormService, ProductsFormData } from './filter-form.service';

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
    private formService: FilterFormService,
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
