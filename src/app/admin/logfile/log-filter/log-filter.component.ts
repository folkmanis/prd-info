import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SystemSettings, LoginService } from 'src/app/login/login.service';
import { LogfileService } from '../../services/logfile.service';
import { GetLogEntriesParams } from '../../services/logfile-record';

import * as moment from 'moment';

@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.css']
})
export class LogFilterComponent implements OnInit, OnDestroy {
  private subs: Subscription;
  constructor(
    private loginService: LoginService,
    private service: LogfileService,
  ) { }

  filterForm = new FormGroup({
    logLevel: new FormControl(0),
    date: new FormControl(moment()),
  });

  logLevels$: Observable<{ key: number, value: string; }[]> = this.loginService.sysPreferences$.pipe(
    map(pref => pref.get('system')),
    map(pref => (<SystemSettings>pref).logLevels),
    map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
    tap(level => this.filterForm.patchValue({
      logLevel: level.reduce((acc, curr) => curr.key > acc ? curr.key : acc, 0)
    })
    ),
  );

  ngOnInit(): void {
    this.subs = this.filterForm.valueChanges.pipe(
      // map(val => ({ ...val, date: (<moment.Moment>val.date).startOf('day').toISOString(true) })),
      map(val => (<GetLogEntriesParams>{
        level: val.logLevel,
        dateFrom: (<moment.Moment>val.date).startOf('day').toISOString(),
        dateTo: (<moment.Moment>val.date).endOf('day').toISOString(),
      })),
      tap(val => console.log(val)),
    )
      .subscribe(this.service.logFilter$);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onDateShift(days: number): void {
    const date: AbstractControl = this.filterForm.get('date');
    date.setValue(<moment.Moment>(date.value).add(days, 'days'));
  }

}
