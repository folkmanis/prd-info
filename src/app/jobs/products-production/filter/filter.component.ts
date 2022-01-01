import { ChangeDetectionStrategy, Component, Inject, OnInit, Output, Self } from '@angular/core';
import { Observable, pluck } from 'rxjs';
import { SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { FilterForm, REPRO_DEFAULTS } from './filter-form';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilterForm]
})
export class FilterComponent implements OnInit {

  @Output() filterChange = this.form.filterChanges;

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates')
  );

  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories')
  );

  large$ = this.layout.isLarge$;

  constructor(
    @Self() public form: FilterForm,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layout: LayoutService
  ) { }

  ngOnInit(): void {
  }

  setRepro() {
    this.form.setValue(REPRO_DEFAULTS);
  }


}
