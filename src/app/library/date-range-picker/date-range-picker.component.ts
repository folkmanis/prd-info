import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DateUtilsService } from 'src/app/library/date-services';

export interface NullableInterval {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-date-range-picker',
  imports: [MatFormFieldModule, MatMenuModule, MatDatepickerModule, MatIcon, MatButtonModule],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent implements FormValueControl<NullableInterval> {
  #dateUtils = inject(DateUtilsService);

  readonly disabled = input(false);

  readonly touched = model(false);

  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  readonly required = input(false);

  readonly value = model<NullableInterval>({
    start: null,
    end: null,
  });

  onThisWeek() {
    this.#setInterval(this.#dateUtils.thisWeek());
  }

  onThisYear() {
    this.#setInterval(this.#dateUtils.thisYear());
  }

  onThisMonth() {
    this.#setInterval(this.#dateUtils.thisMonth());
  }

  onPastYear() {
    this.#setInterval(this.#dateUtils.pastYear());
  }

  onChangeStart(event: MatDatepickerInputEvent<Date>) {
    this.#updateInterval({ start: event.value });
  }

  onChangeEnd(event: MatDatepickerInputEvent<Date>) {
    this.#updateInterval({ end: event.value });
  }

  #updateInterval(update: Partial<NullableInterval>) {
    this.value.update((value) => ({ ...value, ...update }));
    this.touched.set(true);
  }

  #setInterval({ start, end }: NullableInterval) {
    this.value.set({
      start: start,
      end: end,
    });
    this.touched.set(true);
  }
}
