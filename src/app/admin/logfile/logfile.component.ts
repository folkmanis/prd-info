import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import moment from 'moment';
import { combineLatest, OperatorFunction, Observable, ReplaySubject, Subject, pipe } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LogfileApiService } from '../services/logfile-api.service';
import { LogQueryFilter, LogRecord, LogRecordHttp } from '../services/logfile-record';
import { ValidDates } from './valid-dates.class';
import { LogLevel } from './log-level.interface';
import { HttpCacheService } from 'src/app/library/http/http-cache.service';


function logLevels(): OperatorFunction<SystemPreferences, LogLevel[]> {
  return pipe(
    pluck('system', 'logLevels'),
    map(levels => levels.sort((a, b) => a[0] - b[0])),
    map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
  );
}


@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogfileComponent {

  private level$ = new ReplaySubject<number>(1);

  private _logLevelMap$: Observable<Map<number, string>> = this.config$.pipe(
    pluck('system', 'logLevels'),
    map(levels => new Map<number, string>(levels)),
  );

  private _logFilter$: Subject<LogQueryFilter> = new ReplaySubject(1);

  logLevels$: Observable<LogLevel[]> = this.config$.pipe(logLevels());

  log$: Observable<LogRecord[]> = combineLatest([
    this._logFilter$,
    this._logLevelMap$,
  ]).pipe(
    switchMap(([filter, levelMap]) => this.logEntries(filter, levelMap)),
    shareReplay(1),
  );

  validDates$: Observable<ValidDates> = this.level$.pipe(
    switchMap(level => this.api.getDatesGroups({ level })),
    map(dates => new ValidDates(dates)),
  );

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private api: LogfileApiService,
    private cacheService: HttpCacheService,
  ) { }

  onLevel(value: number) {
    this.level$.next(value);
  }

  setFilter(filter: LogQueryFilter) {
    this.cacheService.clear();
    this._logFilter$.next(filter);
  }

  private logEntries(filter: LogQueryFilter, levelMap: Map<number, string>): Observable<LogRecord[]> {
    return this.api.get<LogRecordHttp>(filter).pipe(
      map(records => records.map(rec => ({
        ...rec,
        levelVerb: levelMap.get(rec.level) || rec.level.toString(),
      })))
    );
  }


}
