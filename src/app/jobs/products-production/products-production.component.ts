import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, map, mapTo, share, switchMap } from 'rxjs/operators';
import { JobsProductionFilter, JobsProductionSortQuery } from '../interfaces';
import { JobsApiService, pickNotNull } from '../services/jobs-api.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { combineReload } from 'src/app/library/rxjs';
import { Sort } from '@angular/material/sort';
import { ClassTransformer } from 'class-transformer';
import { LoginService } from 'src/app/login';

const COLUMNS = ['name', 'category', 'units', 'count', 'sum'];
const ADMIN_COLUMNS = [...COLUMNS, 'total'];

@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsProductionComponent implements OnInit {

  displayedColumns$ = this.loginService.isModule('jobs-admin').pipe(
    map(isAdmin => isAdmin ? ADMIN_COLUMNS : COLUMNS),
    share(),
  );

  filter$ = new ReplaySubject<JobsProductionFilter>(1);

  sort$ = new BehaviorSubject<[string, 1 | -1 | undefined] | undefined>(undefined);

  private query$: Observable<JobsProductionSortQuery> = combineLatest([
    this.filter$.pipe(map(filter => this.transformer.instanceToPlain(filter))),
    this.sort$
  ]).pipe(
    map(([filter, sort]) => ({
      ...filter,
      sort,
    })),
    map(query => pickNotNull(query) as unknown as JobsProductionSortQuery),
  );

  jobsProduction$ = combineReload(
    this.query$,
    this.notifications.wsMultiplex('jobs').pipe(mapTo(undefined))
  ).pipe(
    debounceTime(300),
    switchMap(filter => this.api.getJobsProduction(filter)),
  );

  constructor(
    private api: JobsApiService,
    private notifications: NotificationsService,
    private transformer: ClassTransformer,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  onFilter(filter: JobsProductionFilter) {
    this.filter$.next(filter);
  }

  onSortChange(sort: Sort) {
    if (sort.direction === 'asc') {
      this.sort$.next([sort.active, 1]);
      return;
    }
    if (sort.direction === 'desc') {
      this.sort$.next([sort.active, -1]);
      return;
    }
    this.sort$.next(null);
  }

}
