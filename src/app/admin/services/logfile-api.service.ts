import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { LogRecordHttp, LogQueryFilter } from 'src/app/admin/services/logfile-record';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';


@Injectable({
    providedIn: 'root'
})
export class LogfileApiService extends ApiBase<LogRecordHttp> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
    ) {
        super(http, params.apiPath + 'logging/');
    }


    getCount(filter: LogQueryFilter): Observable<number> {
        return this.http.get<{ count: number; }>(
            this.path + 'count',
            new HttpOptions(filter).cacheable()
        ).pipe(
            pluck('count')
        );
    }

    getDatesGroups(filter: LogQueryFilter): Observable<string[]> {
        return this.http.get<string[]>(this.path + 'dates-groups', new HttpOptions(filter).cacheable());
    }

}
