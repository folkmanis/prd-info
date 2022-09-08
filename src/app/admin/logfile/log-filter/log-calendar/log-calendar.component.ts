import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ValidDates } from '../../valid-dates.class';

@Component({
  selector: 'app-log-calendar',
  templateUrl: './log-calendar.component.html',
  styleUrls: ['./log-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogCalendarComponent {

  dateControl = new FormControl<Date>(new Date());

  private _validDates = new ValidDates([]);
  @Input() set validDates(value: ValidDates) {
    if (!value) {
      return;
    }
    this._validDates = value;
    const currentDate = this.dateControl.value;
    if (this.isValiddate(currentDate)) {
      this.dateControl.setValue(currentDate);
    } else {
      this.dateControl.setValue(this.validDates.interval.end);
    }
  }
  get validDates() {
    return this._validDates;
  }

  @Output() selectedDate: Observable<Date> = this.dateControl.valueChanges;

  isValiddate = (date: Date) => this.validDates.isValid(date);
  isMinDate = () => this.validDates.isMin(this.dateControl.value);
  isMaxDate = () => this.validDates.isMax(this.dateControl.value);


  onDateShift(days: 1 | -1): void {
    const currentDate = this.dateControl.value;
    const newDate = this.validDates.shift(currentDate, days);
    if (newDate !== currentDate) {
      this.dateControl.setValue(newDate);
    }
  }

  onToday(): void {
    this.dateControl.setValue(this.isValiddate(new Date()) ? new Date() : this.validDates.interval.end);
  }

}
