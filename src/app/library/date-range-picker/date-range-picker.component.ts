import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateRangePickerComponent,
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor {
  private dateUtils = inject(DateUtilsService);

  disabled = signal(false);

  interval = signal<NullableInterval>({
    start: null,
    end: null,
  });

  onChange = (_: NullableInterval) => {};
  onTouch = () => {};

  writeValue(obj: any): void {
    this.interval.set({
      start: obj?.start || null,
      end: obj?.end || null,
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onThisWeek() {
    this.setInterval(this.dateUtils.thisWeek());
  }

  onThisYear() {
    this.setInterval(this.dateUtils.thisYear());
  }

  onThisMonth() {
    this.setInterval(this.dateUtils.thisMonth());
  }

  onPastYear() {
    this.setInterval(this.dateUtils.pastYear());
  }

  onChangeStart(event: MatDatepickerInputEvent<Date>) {
    this.updateInterval({ start: event.value });
  }

  onChangeEnd(event: MatDatepickerInputEvent<Date>) {
    this.updateInterval({ end: event.value });
  }

  private updateInterval(update: Partial<NullableInterval>) {
    this.interval.update((value) => ({ ...value, ...update }));
    this.onChange(this.interval());
    this.onTouch();
  }

  private setInterval({ start, end }: NullableInterval) {
    this.interval.set({
      start: start,
      end: end,
    });
    this.onChange(this.interval());
    this.onTouch();
  }
}
