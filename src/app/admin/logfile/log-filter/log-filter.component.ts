import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { isEqual } from 'lodash';
import moment from 'moment';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { combineReload } from 'src/app/library/rxjs';
import { LogQueryFilter } from '../../services/logfile-record';
import { ValidDates } from '../valid-dates.class';


@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogFilterComponent {

  private reload$ = new Subject<void>();

  @Output('date') date$ = new ReplaySubject<moment.Moment>(1);

  @Output('levelChange') level$ = new ReplaySubject<number>(1);

  private filter$ = this.date$.pipe(
    withLatestFrom(this.level$),
    distinctUntilChanged(isEqual),
  );

  @Input() validDates: ValidDates;

  @Output('filter') logFilter: Observable<LogQueryFilter> = combineReload(this.filter$, this.reload$).pipe(
    map(([date, level]) => new LogQueryFilter(level, date)),
  );


  onSetDate(value: moment.Moment) {
    this.date$.next(value);
  }

  onReload(): void {
    this.reload$.next();
  }

  onLevel(level: number) {
    this.level$.next(level);
  }


}
