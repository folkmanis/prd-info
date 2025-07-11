import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { parse } from 'date-fns';
import { map, Observable, withLatestFrom } from 'rxjs';
import { LogQueryFilter, LogRecord, LogRecordHttp } from 'src/app/admin/services/logfile-record';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions } from 'src/app/library/http';
import { getConfig } from 'src/app/services/config.provider';

@Injectable({
  providedIn: 'root',
})
export class LogfileApiService {
  private http = inject(HttpClient);

  private levelMap$ = getConfig('system', 'logLevels').pipe(map((levels) => new Map<number, string>(levels)));

  private path = getAppParams().apiPath + 'logging/';

  getLog(filter: LogQueryFilter): Observable<LogRecord[]> {
    return this.http.get<LogRecordHttp[]>(this.path, new HttpOptions(filter).cacheable()).pipe(
      withLatestFrom(this.levelMap$),
      map(([logs, levelMap]) =>
        logs.map((rec) => ({
          ...rec,
          levelVerb: levelMap.get(rec.level) || rec.level.toString(),
        })),
      ),
    );
  }

  getCount(filter: LogQueryFilter): Observable<number> {
    return this.http.get<{ count: number }>(this.path + 'count', new HttpOptions(filter).cacheable()).pipe(map((data) => data.count));
  }

  getDatesGroups(level: number): Observable<Date[]> {
    return this.http.get<string[]>(this.path + 'dates-groups', new HttpOptions({ level }).cacheable()).pipe(map((dates) => dates.map((date) => parse(date, 'y-MM-dd', 0))));
  }
}
