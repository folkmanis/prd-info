import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, pluck, share, shareReplay, switchMap } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LogQueryFilter, LogRecord, LogRecordHttp } from './logfile-record';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

export interface ValidDates {
  dates: Set<string>;
  min?: moment.Moment;
  max?: moment.Moment;
}

@Injectable()
export class LogfileService implements OnDestroy {

  private httpPathLogfile = '/data/log/';
  private _logLevelMap$: Observable<Map<number, string>> = this.config$.pipe(
    pluck('system', 'logLevels'),
    map(levels => new Map<number, string>(levels)),
  );

  private _logFilter$: Subject<LogQueryFilter> = new ReplaySubject(1);

  log$: Observable<LogRecord[]> = combineLatest([
    this._logFilter$,
    this._logLevelMap$,
  ]).pipe(
    switchMap(([filter, levelMap]) => this.logEntries(filter, levelMap)),
    shareReplay(1),
  );

  constructor(
    private apiService: PrdApiService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }


  ngOnDestroy(): void {
    this._logFilter$.complete();
  }

  setFilter(filter: LogQueryFilter) {
    this._logFilter$.next(filter);
  }

  private logEntries(filter: LogQueryFilter, levelMap: Map<number, string>): Observable<LogRecord[]> {
    return this.apiService.logfile.get<LogRecordHttp>(filter).pipe(
      map(records => records.map(rec => ({
        ...rec,
        levelVerb: levelMap.get(rec.level) || rec.level.toString(),
      })))
    );
  }

  datesGroups(filter: LogQueryFilter): Observable<ValidDates> {
    return this.apiService.logfile.getDatesGroups(filter).pipe(
      map(dates => ({
        dates: new Set<string>(dates),
        min: moment(dates.slice(0, 1).pop()),
        max: moment(dates.slice(-1).pop()),
      })),
    );
  }

}
