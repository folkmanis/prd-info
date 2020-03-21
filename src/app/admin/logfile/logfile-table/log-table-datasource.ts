import { Observable, merge, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DataSource } from "@angular/cdk/table";
import { LogRecord } from '../../services/logfile-record';
import { AdminHttpService } from '../../services/admin-http.service';
import { switchMap, tap, map } from 'rxjs/operators';

export class LogTableDatasource implements DataSource<LogRecord> {
    paginator: MatPaginator;

    constructor(
        private service: AdminHttpService,
    ) { }

    connect(): Observable<LogRecord[]> {
        return merge(of({}), this.paginator.page).pipe(
            switchMap(() => this.service.getLogEntries({
                limit: this.paginator.pageSize,
                start: this.paginator.pageIndex * this.paginator.pageSize,
            })),
            tap(resp => this.paginator.length = resp.count),
            map(resp => resp.data),
        );
    }
    disconnect() { }
}