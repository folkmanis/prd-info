import { ChangeDetectionStrategy, Component, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { log } from 'prd-cdk';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, mapTo, share, switchMap } from 'rxjs/operators';
import { combineReload } from 'src/app/library/rxjs';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services/notifications.service';
import { JobsProductionQuery } from '../../interfaces';
import { JobsApiService } from '../../services/jobs-api.service';


const COLUMNS = ['name', 'category', 'units', 'count', 'sum'];
const ADMIN_COLUMNS = [...COLUMNS, 'total'];

const DEFAULT_SORT = 'name';
const DEFAULT_SORT_DIRECTION = 'asc';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent implements OnInit {

  @ViewChild(MatSort)
  private matSort: MatSort;

  @Output('sortChange') sort$ = new Subject<string>();

  activeSort$: Observable<string> = this.route.queryParamMap.pipe(
    log('active sort'),
    map(params => params.has('sort') ? params.get('sort').split(',')[0] : DEFAULT_SORT),
  );
  activeSortDirection$: Observable<SortDirection> = this.route.queryParamMap.pipe(
    map(query => this.sortDirection(query)),
  );

  get activeSortStr(): string {
    return this.sortToString(
      {
        active: this.matSort.active,
        direction: this.matSort.direction,
      }
    );
  }

  displayedColumns$ = this.loginService.isModule('jobs-admin').pipe(
    map(isAdmin => isAdmin ? ADMIN_COLUMNS : COLUMNS),
    share(),
  );

  jobsProduction$ = combineReload(
    this.route.queryParams,
    this.notifications.wsMultiplex('jobs').pipe(mapTo(undefined))
  ).pipe(
    debounceTime(300),
    switchMap((filter: JobsProductionQuery) => this.api.getJobsProduction(filter)),
  );

  constructor(
    private route: ActivatedRoute,
    private api: JobsApiService,
    private notifications: NotificationsService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  onSortChange(sort: Sort) {
    this.sort$.next(
      this.sortToString(sort)
    );
  }

  private sortDirection(query: ParamMap): SortDirection {

    if (query.get('sort')?.split(',')[1] === '-1') {
      return 'desc';
    }

    return 'asc';

  }

  private sortToString({ active, direction }: Sort): string {
    let dir: -1 | 1 = 1;
    if (direction === 'asc') {
      dir = 1;
    }
    if (direction === 'desc') {
      dir = -1;
    }
    return [active, dir].join(',');

  }


}
