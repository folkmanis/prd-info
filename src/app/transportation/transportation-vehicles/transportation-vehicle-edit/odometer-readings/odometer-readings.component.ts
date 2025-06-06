import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { OdometerReading } from 'src/app/transportation/interfaces/transportation-vehicle';
import { OdometerReadingsDialogComponent } from '../odometer-readings-dialog/odometer-readings-dialog.component';

const sortData = (readings: OdometerReading[]) => [...readings].sort((a, b) => a.date.getTime() - b.date.getTime());

const isValidData = (readings: OdometerReading[]): boolean => {
  if (!readings || readings.length === 0) {
    return true;
  }
  const initialReading = readings[0].value;
  return readings.every((reading) => {
    const result = OdometerReading.safeParse(reading);
    return result.success && reading.value >= initialReading;
  });
};

@Component({
  selector: 'app-odometer-readings',
  imports: [DatePipe, MatIcon, MatIconButton],
  templateUrl: './odometer-readings.component.html',
  styleUrl: './odometer-readings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OdometerReadingsComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: OdometerReadingsComponent,
      multi: true,
    },
  ],
})
export class OdometerReadingsComponent implements ControlValueAccessor, Validator {
  #onTouch: () => void = () => {};
  #onChange: (value: OdometerReading[]) => void = () => {};
  #dialog = inject(MatDialog);
  #snack = inject(MatSnackBar);

  protected data = signal<OdometerReading[]>([]);
  protected disabled = signal<boolean>(false);

  writeValue(value: OdometerReading[]): void {
    if (Array.isArray(value)) {
      this.data.set(value);
    } else {
      this.data.set([]);
    }
  }

  registerOnChange(fn: (value: OdometerReading[]) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  validate(): ValidationErrors | null {
    const result = OdometerReading.array().safeParse(this.data());
    if (!result.success) {
      return { invalidOdometerReadings: result.error };
    }
    return null;
  }

  async onAdd() {
    this.#onTouch();
    const dialogRef = this.#dialog.open(OdometerReadingsDialogComponent, {
      data: null,
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      const sorted = sortData([...this.data(), result]);
      if (!isValidData(sorted)) {
        this.#snack.open('Nepareizi dati. Rādījumiem jābūt augošā secībā.', 'OK');
        return;
      }
      this.data.set(sorted);
      this.#onChange(this.data());
    }
  }

  async onEdit(index: number) {
    this.#onTouch();
    const dialogRef = this.#dialog.open(OdometerReadingsDialogComponent, {
      data: this.data()[index],
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      const updated = [...this.data()];
      updated[index] = result;
      const sorted = sortData(updated);
      if (!isValidData(sorted)) {
        this.#snack.open('Nepareizi dati. Rādījumiem jābūt augošā secībā.', 'OK');
        return;
      }

      this.data.set(sorted);
      this.#onChange(this.data());
    }
  }

  onRemove(index: number) {
    this.#onTouch();
    this.data.update((readings) => readings.filter((_, i) => i !== index));
    this.#onChange(this.data());
  }
}
