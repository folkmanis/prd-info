import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OdometerReading } from 'src/app/transportation/interfaces/transportation-vehicle';
import { form, FormField, min, required } from '@angular/forms/signals';

@Component({
  selector: 'app-odometer-readings-dialog',
  imports: [FormField, MatDialogModule, MatFormFieldModule, MatInputModule, MatButton, MatDatepickerModule],
  templateUrl: './odometer-readings-dialog.component.html',
  styleUrl: './odometer-readings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OdometerReadingsDialogComponent {
  private data = inject<OdometerReading>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef<OdometerReadingsDialogComponent>);

  protected odometerModel = signal({
    value: this.data?.value ?? 0,
    date: this.data?.date ?? new Date(),
  });
  protected odometerForm = form(this.odometerModel, (schema) => {
    required(schema.value);
    min(schema.value, 0);
    required(schema.date);
  });

  onSubmit() {
    this.dialogRef.close(this.odometerModel());
  }
}
