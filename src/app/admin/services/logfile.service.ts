import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminHttpService } from './admin-http.service';
import { LogRecord, LogData } from './logfile-record';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LogfileService implements DataSource<LogRecord> {

  constructor(
    private adminHttp: AdminHttpService
  ) { }

  private _paginator: MatPaginator;
  private start = 0;
  private limit = 100;
  private count = 0;

  get logRecords$(): Observable<LogRecord[]> {
    return this.adminHttp.getLogEntries({}).pipe(
      tap(resp=> this._paginator.length = resp.count),
      tap(resp => console.log(resp.count)),
      map(resp => resp.data)
    );
  }

  connect(): Observable<LogRecord[]> {
    return this.logRecords$;
  }

  disconnect() {
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
  }

}
