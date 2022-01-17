import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { combineLatest, concat, debounceTime, map, mapTo, merge, Observable, of, pluck, Subject, switchMap, take, takeUntil } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from 'src/app/services/notifications.service';
import { JobsProductionFilterQuery } from '../interfaces';
import { JobsApiService } from '../services/jobs-api.service';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { ProductsProductionPreferencesUpdaterService } from './services/products-production-preferences-updater.service';


@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ],
})
export class ProductsProductionComponent implements OnInit {

  readonly sortChange$ = new Subject<string>();
  readonly savedSort$ = this.prefService.userPreferences$.pipe(
    take(1),
    pluck('jobsProductionQuery', 'sort'),
    map(sort => sort || 'name,1'),
  );
  readonly sort$ = concat(
    this.savedSort$,
    this.sortChange$
  );

  readonly filterChange$ = new Subject<JobsProductionFilterQuery>();
  readonly savedFilter$ = this.prefService.userPreferences$.pipe(
    take(1),
    pluck('jobsProductionQuery'),
  );
  readonly filter$: Observable<JobsProductionFilterQuery> = concat(
    this.savedFilter$,
    this.filterChange$
  );

  private readonly offset$ = of({ start: 0, limit: 100 });

  private readonly query$ = combineLatest({
    filter: this.filter$,
    sort: this.sort$,
    start: this.offset$,
  }).pipe(
    debounceTime(300),
    map(({ filter, sort, start }) => ({ ...filter, sort, ...start })),
  );

  data$ = combineReload(
    this.query$,
    this.notifications.wsMultiplex('jobs').pipe(mapTo(undefined))
  ).pipe(
    switchMap(query => this.api.getJobsProduction(query))
  );


  constructor(
    private prefService: JobsUserPreferencesService,
    private api: JobsApiService,
    private notifications: NotificationsService,
    private prefStorage: ProductsProductionPreferencesUpdaterService,
    private destroy$: DestroyService,
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
