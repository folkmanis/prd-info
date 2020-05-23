import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, pluck, share, switchMap } from 'rxjs/operators';
import { StoreState, SystemSettings } from 'src/app/interfaces';
import { getModulePreferences } from 'src/app/store/selectors';
import { HttpOptions } from '../../../library/http/http-options';
import { GetLogEntriesParams, LogData, LogDataHttp } from './logfile-record';

export interface ValidDates {
  dates: Set<string>;
  min: moment.Moment | undefined;
  max: moment.Moment | undefined;
}

@Injectable()
export class LogfileService {
  private httpPathLogfile = '/data/log/';

  constructor(
    private http: HttpClient,
    private store: Store<StoreState>,
  ) { }

  logFilter$: Subject<GetLogEntriesParams> = new ReplaySubject(1);
  log$: Observable<LogData> = this.logFilter$.pipe(
    switchMap(filter => this.getLogEntriesHttp(filter)),
    share(),
  );

  getLogEntriesHttp(params: GetLogEntriesParams): Observable<LogData> {
    return combineLatest([
      this.http.get<LogDataHttp>(this.httpPathLogfile + 'entries', new HttpOptions(params)),
      this.store.select(getModulePreferences, { module: 'system' }).pipe(
        map((sys: SystemSettings) => new Map<number, string>(sys.logLevels)),
      )
    ]).pipe(
      map(([records, pref]) => ({
        ...records,
        data: records.data.map(rec =>
          ({
            ...rec,
            levelVerb: pref.get(rec.level) || rec.level.toString(),
          })
        )
      })
      ),
    );
  }

  getInfos(): Observable<string[]> {
    return this.http.get<{ data: string[]; }>(this.httpPathLogfile + 'entries', new HttpOptions())
      .pipe(map(dat => dat.data));
  }
  /**
   * Datumi, kuros ir log ieraksti attiecīgajam min errorlevel
   * @param params level: minimālais errorlevel, start, end: sākuma un beigu datumi
   */
  getDatesGroupsHttp(params: { level: number, start?: string, end?: string; }): Observable<ValidDates> {
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
