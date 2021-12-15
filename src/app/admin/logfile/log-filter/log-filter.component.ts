import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { combineLatest, merge, Observable, OperatorFunction, ReplaySubject, Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';
import { LogQueryFilter } from '../../services/logfile-record';
import { ValidDates } from '../valid-dates.class';
import { LogLevel } from '../log-level.interface';

interface FilterForm {
  level: number;
  date: moment.Moment;
}

@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogFilterComponent implements OnInit {


  @Output() reload = new Subject<void>();

  @Output('date') date$ = new ReplaySubject<moment.Moment>(1);

  @Output('levelChange') level$ = new ReplaySubject<number>(1);

  private filter$ = combineLatest({
    level: this.level$,
    date: this.date$
  });

  @Input() validDates: ValidDates;

  @Input() logLevels: LogLevel[];

  @Output('filter') logFilter: Observable<LogQueryFilter> = merge(
    this.filter$,
    this.reload
  ).pipe(
    scan((initial, val) => {
      if (!initial) {
        throw new Error('Value must be supplied before reload');
      }
      return val || initial;
    }),
    this.formToFilter(),
  );


  constructor(
  ) { }

  ngOnInit(): void {
  }

  onSetDate(value: moment.Moment) {
    this.date$.next(value);
  }

  onReload(): void {
    this.reload.next();
  }

  onLevel(level: number) {
    if (level >= 0) {
      this.level$.next(level);
    }
  }

  private formToFilter(): OperatorFunction<FilterForm, LogQueryFilter> {
    return map(({ level, date }) => ({
      level,
      dateFrom: date.startOf('day').toISOString(),
      dateTo: date.endOf('day').toISOString(),
    }));
  }

}
