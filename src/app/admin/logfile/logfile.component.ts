import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpCacheService } from 'src/app/library/http/http-cache.service';
import { LogfileApiService } from '../services/logfile-api.service';
import { LogQueryFilter, LogRecord } from '../services/logfile-record';
import { ValidDates } from './valid-dates.class';
import { AsyncPipe } from '@angular/common';
import { LogfileTableComponent } from './logfile-table/logfile-table.component';
import { LogFilterComponent } from './log-filter/log-filter.component';


@Component({
    selector: 'app-logfile',
    templateUrl: './logfile.component.html',
    styleUrls: ['./logfile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        LogFilterComponent,
        LogfileTableComponent,
        AsyncPipe,
    ],
})
export class LogfileComponent {

  private level$ = new ReplaySubject<number>(1);

  private logFilter$: Subject<LogQueryFilter> = new ReplaySubject(1);

  log$: Observable<LogRecord[]> = this.logFilter$.pipe(
    switchMap(filter => this.api.getLog(filter)),
  );

  validDates$: Observable<ValidDates> = this.level$.pipe(
    switchMap(level => this.api.getDatesGroups(level)),
    map(dates => new ValidDates(dates)),
  );

  constructor(
    private api: LogfileApiService,
    private cacheService: HttpCacheService,
  ) { }

  onLevel(value: number) {
    this.level$.next(value);
  }

  setFilter(filter: LogQueryFilter) {
    this.cacheService.clear();
    this.logFilter$.next(filter);
  }


}
