import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { LogRecordHttp, LogQueryFilter, LogRecord } from 'src/app/admin/services/logfile-record';
import { Observable, OperatorFunction, pipe } from 'rxjs';
import { map, pluck, withLatestFrom } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { parse } from 'date-fns';

function addLevelName(config: Observable<SystemPreferences>): OperatorFunction<LogRecordHttp[], LogRecord[]> {
    const levelMap: Observable<Map<number, string>> = config.pipe(
        pluck('system', 'logLevels'),
        map(levels => new Map<number, string>(levels)),
    );
    return pipe(
        withLatestFrom(levelMap),
        map(([logs, levelMap]) => logs.map(rec => ({
            ...rec,
            levelVerb: levelMap.get(rec.level) || rec.level.toString(),
        }))),
    );
}

@Injectable({
    providedIn: 'root'
})
export class LogfileApiService extends ApiBase<LogRecordHttp> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        @Inject(CONFIG) private config$: Observable<SystemPreferences>,
        http: HttpClient,
    ) {
        super(http, params.apiPath + 'logging/');
    }

    getLog(filter: LogQueryFilter): Observable<LogRecord[]> {
        return super.get(filter).pipe(
            addLevelName(this.config$),
        );
    }

    getCount(filter: LogQueryFilter): Observable<number> {
        return this.http.get<{ count: number; }>(
            this.path + 'count',
            new HttpOptions(filter).cacheable()
        ).pipe(
            pluck('count')
        );
    }

    getDatesGroups(level: number): Observable<Date[]> {
        return this.http.get<string[]>(this.path + 'dates-groups', new HttpOptions({ level }).cacheable()).pipe(
            map(dates => dates.map(date => parse(date, 'y-MM-dd', 0))),
        );
    }


}
