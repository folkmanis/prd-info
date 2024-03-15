import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isFirstDate, isLastDate, isValidDate, lastDate, shiftDate, validDate } from '../../log-dates-utils';

@Component({
  selector: 'app-log-calendar',
  templateUrl: './log-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LogCalendarComponent {

  date = model.required<Date>();

  availableDates = input<Date[]>([]);

  lastDate = computed(() => lastDate(this.availableDates()));

  isMinDate = computed(() => isFirstDate(this.date(), this.availableDates()));
  isMaxDate = computed(() => isLastDate(this.date(), this.availableDates()));

  isValiddate = (date: Date) => isValidDate(date, this.availableDates());

  onDateShift(days: 1 | -1): void {
    const currentDate = this.date();
    const newDate = shiftDate(currentDate, days, this.availableDates());
    this.date.set(newDate);
  }

  onToday(): void {
    this.date.set(validDate(new Date(), this.availableDates()));
  }

}
