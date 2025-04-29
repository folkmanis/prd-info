import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FuelType } from 'src/app/interfaces';

@Component({
  selector: 'app-fuel-type-dialog',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatInput, MatButton],
  templateUrl: './fuel-type-dialog.component.html',
  styleUrl: './fuel-type-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelTypeDialogComponent {
  private data = inject<FuelType>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  form = inject(FormBuilder).nonNullable.group({
    type: [this.data?.type, [Validators.required]],
    description: [this.data?.description],
    units: [this.data?.units, [Validators.required]],
  });

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }
}
