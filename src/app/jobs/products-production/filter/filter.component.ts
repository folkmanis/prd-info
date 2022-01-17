import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Output } from '@angular/core';
import { Observable, pluck } from 'rxjs';
import { SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobsProductionFilterQuery } from '../../interfaces';
import { FilterForm, ProductsFormData } from './filter-form';

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
  providers: [
    FilterForm,
  ]
})
export class FilterComponent implements OnInit {

  @Input('filter')
  set filter(value: JobsProductionFilterQuery) {
    if (!value) {
      return;
    }
    this.form.setValueFromQuery(value, { emitEvent: false });
  }
  get filter(): JobsProductionFilterQuery {
    return this.form.filterValue;
  }

  @Output() filterChanges = this.form.filterQueryChanges;

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates')
  );

  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories')
  );

  large$ = this.layout.isLarge$;

  constructor(
    public form: FilterForm,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layout: LayoutService,
  ) { }

  ngOnInit(): void {
  }

  setRepro() {
    this.form.setValue(REPRO_DEFAULTS);
  }

}
