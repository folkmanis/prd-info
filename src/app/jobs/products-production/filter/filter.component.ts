import { ChangeDetectionStrategy, Component, Inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { log } from 'prd-cdk';
import { Observable, pluck } from 'rxjs';
import { SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { FilterForm } from './filter-form';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

  @Output() filterChange = this.form.filterChanges.pipe(
    log('filter changes')
  );

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
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(query => {
      this.form.setFormFromRouteParams(query, { emitEvent: false });
    });
  }


}
