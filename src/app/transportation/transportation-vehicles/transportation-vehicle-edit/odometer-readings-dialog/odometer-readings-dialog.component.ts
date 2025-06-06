import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OdometerReading } from 'src/app/transportation/interfaces/transportation-vehicle';

@Component({
  selector: 'app-odometer-readings-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule],
  templateUrl: './odometer-readings-dialog.component.html',
  styleUrl: './odometer-readings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OdometerReadingsDialogComponent {
  private data = inject<OdometerReading>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef<OdometerReadingsDialogComponent>);

  form = inject(FormBuilder).nonNullable.group({
    value: [this.data?.value, [Validators.required, Validators.min(0)]],
    date: [this.data?.date ?? new Date(), [Validators.required]],
  });

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }
}
