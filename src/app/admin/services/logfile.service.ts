import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, pluck, share, shareReplay, switchMap } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { HttpOptions } from '../../library/http/http-options';
import { GetLogEntriesParams, LogData, LogDataHttp, LogRecord } from './logfile-record';

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

  private _logFilter$: Subject<GetLogEntriesParams> = new ReplaySubject(1);

  log$: Observable<LogRecord[]> = combineLatest([
    this._logFilter$,
    this._logLevelMap$,
  ]).pipe(
    switchMap(([filter, levelMap]) => this.getLogEntriesHttp(filter, levelMap)),
    shareReplay(1),
    pluck('data'),
  );

  constructor(
    private http: HttpClient,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }


  ngOnDestroy(): void {
    this._logFilter$.complete();
  }

  setFilter(filter: GetLogEntriesParams) {
    this._logFilter$.next(filter);
  }

  private getLogEntriesHttp(params: GetLogEntriesParams, levelMap: Map<number, string>): Observable<LogData> {
    return this.http.get<LogDataHttp>(this.httpPathLogfile + 'entries', new HttpOptions(params)).pipe(
      map(records => ({
        ...records,
        data: records.data.map(rec =>
        ({
          ...rec,
          levelVerb: levelMap.get(rec.level) || rec.level.toString(),
        })
        )
      })
      )
    );
  }

  getInfos(): Observable<string[]> {
    return this.http.get<{ data: string[]; }>(this.httpPathLogfile + 'entries', new HttpOptions())
      .pipe(map(dat => dat.data));
  }
  /**
   * Datumi, kuros ir log ieraksti attiecīgajam min errorlevel
   *
   * @param params level: minimālais errorlevel, start, end: sākuma un beigu datumi
   */
  getDatesGroupsHttp(params: { level: number; start?: string; end?: string; }): Observable<ValidDates> {
    return this.http.get<{ data: { _id: string; }[]; }>(this.httpPathLogfile + 'dates-groups', new HttpOptions(params)).pipe(
      pluck('data'),
      map(dates => dates.map(date => date._id)),
      map(dates => ({
        dates: new Set<string>(dates), // šķirots masīvs ar datumiem
        min: moment(dates.slice(0, 1).pop()), // masīva pirmais elements
        max: moment(dates.slice(-1).pop()), // masīva pēdējais elements
      })),
    );
  }

}
