import { LoginService } from 'src/app/login';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { combineLatest, concat, debounceTime, map, merge, Observable, of, share, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { JobsProduction, JobsProductionFilterQuery } from '../interfaces';
import { JobsApiService } from '../services/jobs-api.service';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { ProductsProductionPreferencesUpdaterService } from './services/products-production-preferences-updater.service';
import { Totals } from './services/totals';
import { AsyncPipe } from '@angular/common';
import { ScrollTopDirective } from '../../library/scroll-to-top/scroll-top.directive';
import { ProductsTableComponent } from './products-table/products-table.component';
import { FilterComponent } from './filter/filter.component';


@Component({
    selector: 'app-products-production',
    templateUrl: './products-production.component.html',
    styleUrls: ['./products-production.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DestroyService,
    ],
    standalone: true,
    imports: [
        FilterComponent,
        ProductsTableComponent,
        ScrollTopDirective,
        AsyncPipe,
    ],
})
export class ProductsProductionComponent implements OnInit {

  readonly sortChange$ = new Subject<string>();
  readonly savedSort$ = this.prefService.userPreferences$.pipe(
    take(1),
    map(data => data.jobsProductionQuery.sort),
    map(sort => sort || 'name,1'),
  );

  readonly filterChange$ = new Subject<JobsProductionFilterQuery>();
  readonly savedFilter$ = this.prefService.userPreferences$.pipe(
    take(1),
    map(data => data.jobsProductionQuery),
  );
  readonly filter$: Observable<JobsProductionFilterQuery> = concat(
    this.savedFilter$,
    this.filterChange$
  );

  private readonly offset$ = of({ start: 0, limit: 1000 });

  private readonly query$ = combineLatest({
    filter: this.filter$,
    sort: of('name,1'),
    start: this.offset$,
  }).pipe(
    debounceTime(300),
    map(({ filter, sort, start }) => ({ ...filter, sort, ...start })),
  );

  data$ = combineReload(
    this.query$,
    this.notifications.wsMultiplex('jobs').pipe(map(() => undefined))
  ).pipe(
    switchMap(query => this.api.getJobsProduction(query)),
    tap(products => this.selection = products),
    share(),
  );

  totals = new Totals();

  isAdmin$ = this.loginService.isModule('jobs-admin');

  private _selection: JobsProduction[] = [];
  set selection(value: JobsProduction[]) {
    this._selection = value || [];
    this.totals = this.selection.reduce((acc, curr) => acc.add(curr), new Totals());
  }
  get selection() {
    return this._selection;
  }


  constructor(
    private prefService: JobsUserPreferencesService,
    private api: JobsApiService,
    private notifications: NotificationsService,
    private prefStorage: ProductsProductionPreferencesUpdaterService,
    private destroy$: DestroyService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

    merge(
      this.sortChange$.pipe(map(sort => ({ sort }))),
      this.filterChange$.pipe(debounceTime(100))
    ).pipe(
      takeUntil(this.destroy$),
      this.prefStorage.savePreferences()
    ).subscribe();

  }

  onSort(value: string) {
    this.sortChange$.next(value);
  }

  onFilter(value: JobsProductionFilterQuery) {
    this.filterChange$.next(value);
  }



}
