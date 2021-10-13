import { ApiBase, HttpOptions } from 'src/app/library/http';
import { LogRecordHttp, LogQueryFilter } from 'src/app/admin/services/logfile-record';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

export class LogfileApi extends ApiBase<LogRecordHttp> {

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
