import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { DestroyService } from 'prd-cdk';
import { CONFIG } from 'src/app/services/config.provider';
import { LogQueryFilter } from '../../services/logfile-record';
import { LogfileService, ValidDates } from '../../services/logfile.service';
import { log } from 'prd-cdk';


interface FilterForm {
  logLevel: number;
  date: moment.Moment;
}

@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class LogFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  maxDate = moment();
  filterForm = new FormGroup({
    logLevel: new FormControl(0),
    date: new FormControl(moment()),
  });

  logLevels$: Observable<{ key: number; value: string; }[]> = this.config$.pipe(
    pluck('system', 'logLevels'),
    log('loglevels'),
    map(levels => levels.sort((a, b) => a[0] - b[0])),
    map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
  );


  private readonly dateControl = this.filterForm.get('date');
  private validDates: ValidDates = { dates: new Set() };

  constructor(
    private service: LogfileService,
    private destroy$: DestroyService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  ngOnInit(): void {
    /** Jauna tabula */
    this.filterForm.valueChanges.pipe(
      map(form => this.formToReq(form)),
      takeUntil(this.destroy$),
    ).subscribe(fltr => this.service.setFilter(fltr));
    /** Jauns kalendārs */
    this.filterForm.get('logLevel').valueChanges.pipe(
      filter(val => val > 0),
      distinctUntilChanged(),
      switchMap(level => this.service.datesGroups({ level })),
      takeUntil(this.destroy$),
    ).subscribe(dates => {
      this.validDates = dates;
      if (!this.isValiddate(this.dateControl.value)) {
        this.filterForm.patchValue({ date: this.validDates.max });
      }
    });

    this.logLevels$.pipe(
      map(levs => Math.max(...levs.map(({ key }) => key))),
      takeUntil(this.destroy$),
    ).subscribe(logLevel => this.filterForm.patchValue({ logLevel }));
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  isValiddate = (date: moment.Moment): boolean => this.validDates.dates.has(date?.format('Y-MM-DD'));

  isMinDate = (): boolean => this.dateControl.value.isSame(this.validDates.min, 'days');

  isMaxDate = (): boolean => this.dateControl.value.isSame(this.validDates.max, 'days');

  onDateShift(days: number): void {
    const newDate = moment(this.dateControl.value).add(days, 'days');
    while (newDate.isBetween(this.validDates.min, this.validDates.max, 'date', '[]') && !this.isValiddate(newDate)) {
      newDate.add(days, 'days');
    }
    if (!newDate.isBetween(this.validDates.min, this.validDates.max, 'date', '[]')) {
      return;
    }
    this.dateControl.setValue(newDate);
  }

  onReload(): void {
    this.service.setFilter(this.formToReq(this.filterForm.value));
  }

  onToday(): void {
    this.dateControl.setValue(this.isValiddate(moment()) ? moment() : this.validDates.max);
  }

  private formToReq(val: FilterForm): LogQueryFilter {
    return ({
      level: val.logLevel,
      dateFrom: (val.date as moment.Moment).startOf('day').toISOString(),
      dateTo: (val.date as moment.Moment).endOf('day').toISOString(),
    } as LogQueryFilter);
  }

}
