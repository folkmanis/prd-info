import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { debounceTime, mapTo, switchMap } from 'rxjs/operators';
import { JobsProductionQuery } from '../interfaces';
import { JobsApiService } from '../services/jobs-api.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { combineReload } from 'src/app/library/rxjs';

@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsProductionComponent implements OnInit {

  displayedColumns = ['name', 'category', 'units', 'count', 'sum', 'total'];

  filter$ = new ReplaySubject<JobsProductionQuery>(1);

  jobsProduction$ = combineReload(
    this.filter$,
    this.notifications.wsMultiplex('jobs').pipe(mapTo(undefined))
  ).pipe(
    debounceTime(300),
    switchMap(filter => this.api.getJobsProduction(filter))
  );

  constructor(
    private api: JobsApiService,
    private notifications: NotificationsService,
  ) { }

  ngOnInit(): void {
  }

  onFilter(filter: JobsProductionQuery) {
    this.filter$.next(filter);
  }

}
