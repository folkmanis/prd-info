import { ChangeDetectionStrategy, Component, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { Observable, shareReplay, startWith } from 'rxjs';
import { ValidDates } from '../../valid-dates.class';

@Component({
  selector: 'app-log-calendar',
  templateUrl: './log-calendar.component.html',
  styleUrls: ['./log-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogCalendarComponent implements OnInit {


  dateControl = new FormControl(moment());

  private _validDates = new ValidDates([]);
  @Input() set validDates(value: ValidDates) {
    if (!value) {
      return;
    }
    this._validDates = value;
    if (!this.isValiddate(this.dateControl.value)) {
      this.dateControl.setValue(this.validDates.max);
    }
  }
  get validDates() {
    return this._validDates;
  }

  @Output() selectedDate: Observable<moment.Moment> = this.dateControl.valueChanges.pipe(
    startWith(this.dateControl.value)
  );

  isValiddate = (date: moment.Moment) => this.validDates.isValid(date);
  isMinDate = () => this.validDates.isMin(this.dateControl.value);
  isMaxDate = () => this.validDates.isMax(this.dateControl.value);


  constructor() { }

  ngOnInit(): void {
  }


  onDateShift(days: 1 | -1): void {
    const currentDate = this.dateControl.value;
    const newDate = this.validDates.shift(currentDate, days);
    if (newDate !== currentDate) {
      this.dateControl.setValue(newDate);
    }
  }

  onToday(): void {
    this.dateControl.setValue(this.isValiddate(moment()) ? moment() : this.validDates.max);
  }

}
