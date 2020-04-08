import { Observable, merge, of } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { LogRecord } from '../../services/logfile-record';
import { LogfileService } from '../../services/logfile.service';
import { switchMap, tap, map } from 'rxjs/operators';

export class LogTableDatasource implements DataSource<LogRecord> {

    constructor(
        private service: LogfileService,
    ) { }

    connect(): Observable<LogRecord[]> {
        return this.service.log$.pipe(
            map(resp => resp.data),
        );
    }
    disconnect() { }
}
