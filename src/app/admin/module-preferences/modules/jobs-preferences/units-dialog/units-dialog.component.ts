import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class UnitsDialogComponent {
  private data = inject<ProductUnit>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  unitsForm = inject(FormBuilder).group({
    shortName: [{ value: this.data?.shortName, disabled: !!this.data }, [Validators.required]],
    description: [this.data?.description],
    disabled: [this.data?.disabled ?? false],
  });

  onSubmit() {
    this.dialogRef.close(this.unitsForm.getRawValue());
  }
}
