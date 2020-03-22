import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from "../../library/http/http-options";
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, tap, startWith,switchMap, shareReplay } from 'rxjs/operators';
import { LoginService } from '../../login/login.service';
import { LogRecord, LogRecordHttp, LogDataHttp, GetLogEntriesParams, LogData } from './logfile-record';
import { DbModulePreferences, ModuleSettings, SystemPreferences, SystemSettings } from '../../library/classes/system-preferences-class';

@Injectable()
export class LogfileService {
  private httpPathLogfile = '/data/log/';

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) { }

  logFilter$: Subject<GetLogEntriesParams> = new Subject();
  log$: Observable<LogData> = this.logFilter$.pipe(
    // startWith({}),
    switchMap(filter=> this.getLogEntries(filter)),
    shareReplay(1),
  )

  getLogEntries(params: GetLogEntriesParams): Observable<LogData> {
    return combineLatest([
      this.http.get<LogDataHttp>(this.httpPathLogfile + 'entries', new HttpOptions(params)),
      this.loginService.sysPreferences$.pipe(
        map(pref => (pref.get('system') as SystemSettings)),
        map(sys => new Map<number, string>(sys.logLevels)),
      )
    ]).pipe(
      map(([records, pref]) => ({
        ...records,
        data: records.data.map(rec =>
          ({ ...rec, levelVerb: pref.get(rec.level) || rec.level.toString() })
        )
      })
      ),
    );
  }

  getInfos(): Observable<string[]> {
    return this.http.get<{ data: string[]; }>(this.httpPathLogfile + 'entries', new HttpOptions())
      .pipe(map(dat => dat.data));
  }

}
