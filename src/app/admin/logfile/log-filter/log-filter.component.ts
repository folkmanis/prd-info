import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { LoginService, SystemSettings } from 'src/app/login/login.service';
import { GetLogEntriesParams } from '../../services/logfile-record';
import { LogfileService, ValidDates } from '../../services/logfile.service';


interface FormValues {
  logLevel: number;
  date: moment.Moment;
}

let validDates: ValidDates;

@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.css']
})
export class LogFilterComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription = new Subscription();

  constructor(
    private loginService: LoginService,
    private service: LogfileService,
  ) { }
  maxDate = moment();
  filterForm = new FormGroup({
    logLevel: new FormControl(),
    date: new FormControl(),
  });
  private readonly dateControl = this.filterForm.get('date');
  filterDefaults: FormValues = {
    logLevel: 0,
    date: moment(),
  };

  logLevels$: Observable<{ key: number, value: string; }[]> = this.loginService.sysPreferences$.pipe(
    map(pref => pref.get('system')),
    map(pref => (pref as SystemSettings).logLevels),
    map(levels => levels.sort((a, b) => a[0] - b[0])),
    map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
    tap(level => this.filterDefaults.logLevel = level.reduce((acc, curr) => curr.key > acc ? curr.key : acc, 0)),
    tap(() => this.filterForm.patchValue({ logLevel: this.filterDefaults.logLevel })),
  );

  ngOnInit(): void {
    /** Jauna tabula */
    this.subs.add(
      this.filterForm.valueChanges.pipe(
        map(form => this.formToReq(form)),
      ).subscribe(this.service.logFilter$)
    );
    /** Jauns kalendārs */
    this.subs.add(
      this.filterForm.get('logLevel').valueChanges.pipe(
        filter(val => val > 0),
        distinctUntilChanged(),
        switchMap(level => this.service.getDatesGroupsHttp({ level })),
        tap(dates => validDates = dates),
        tap(() => !this.isValiddate(this.dateControl.value) && this.filterForm.patchValue({ date: validDates.max }))
      ).subscribe()
    );
    this.filterForm.setValue(this.filterDefaults);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  isValiddate(date: moment.Moment): boolean {
    return !validDates || validDates.dates.has(date.format('Y-MM-DD'));
  }

  onDateShift(days: number): void {
    const newDate = moment(this.dateControl.value).add(days, 'days');
    while (newDate.isBetween(validDates.min, validDates.max, 'date', '[]') && !this.isValiddate(newDate)) {
      newDate.add(days, 'days');
    }
    if (!newDate.isBetween(validDates.min, validDates.max, 'date', '[]')) {
      return;
    }
    this.dateControl.setValue(newDate);
  }

  isMinDate(): boolean {
    return !validDates || this.dateControl.value.isSame(validDates.min, 'days');
  }
  isMaxDate(): boolean {
    return !validDates || this.dateControl.value.isSame(validDates.max, 'days');
  }

  onReload(): void {
    this.service.logFilter$.next(this.formToReq(this.filterForm.value));
  }

  onToday(): void {
    this.dateControl.setValue(this.isValiddate(moment()) ? moment() : validDates.max);
  }

  private formToReq(val: FormValues): GetLogEntriesParams {
    return ({
      level: val.logLevel,
      dateFrom: (val.date as moment.Moment).startOf('day').toISOString(),
      dateTo: (val.date as moment.Moment).endOf('day').toISOString(),
    } as GetLogEntriesParams);
  }

}
