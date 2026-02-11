import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { OdometerReading } from 'src/app/transportation/interfaces/transportation-vehicle';
import { OdometerReadingsDialogComponent } from '../odometer-readings-dialog/odometer-readings-dialog.component';

@Component({
  selector: 'app-odometer-readings',
  imports: [DatePipe, MatIcon, MatIconButton],
  templateUrl: './odometer-readings.component.html',
  styleUrl: './odometer-readings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OdometerReadingsComponent {
  odometerReadings = input.required<OdometerReading[]>();

  disabled = input(false);

  odometerReadingsChange = output<OdometerReading[]>();

  #dialog = inject(MatDialog);
  #snack = inject(MatSnackBar);

  async onAdd() {
    const dialogRef = this.#dialog.open(OdometerReadingsDialogComponent, {
      data: null,
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (!result) {
      return;
    }
    const sorted = this.#sortByDate([...this.odometerReadings(), result]);
    if (this.#validate(sorted) === false) {
      return;
    }
    this.odometerReadingsChange.emit(sorted);
  }

  async onEdit(index: number) {
    const dialogRef = this.#dialog.open(OdometerReadingsDialogComponent, {
      data: this.odometerReadings()[index],
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (!result) {
      return;
    }
    const updated = [...this.odometerReadings()];
    updated[index] = result;
    const sorted = this.#sortByDate(updated);
    if (this.#validate(sorted) === false) {
      return;
    }
    this.odometerReadingsChange.emit(sorted);
  }

  onRemove(index: number) {
    const updated = this.odometerReadings().filter((_, i) => i !== index);
    this.odometerReadingsChange.emit(updated);
  }

  #sortByDate = (readings: OdometerReading[]) => [...readings].sort((a, b) => a.date.getTime() - b.date.getTime());

  #validate(readings: OdometerReading[]): boolean {
    if (!readings || readings.length === 0) {
      return true;
    }
    const initialReading = readings[0].value;
    const isAsc = readings.every((reading) => OdometerReading.safeParse(reading).success && reading.value >= initialReading);
    if (isAsc === false) {
      this.#snack.open('Nepareizi dati. Rādījumiem jābūt augošā secībā.', 'OK');
      return false;
    }
    return true;
  }
}
