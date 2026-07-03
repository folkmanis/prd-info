import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FuelTypeModelSchema, validateFuelType } from '../transportation-settings.model';

@Component({
  selector: 'app-fuel-type-dialog',
  imports: [FormField, FormRoot, MatFormFieldModule, MatInput, MatButton, MatDialogModule],
  templateUrl: './fuel-type-dialog.component.html',
  styleUrl: './fuel-type-dialog.component.scss',
})
export class FuelTypeDialogComponent {
  #data = inject(MAT_DIALOG_DATA, { optional: true });
  #dialogRef = inject(MatDialogRef);

  #fuleTypeModel = signal(FuelTypeModelSchema.parse(this.#data || undefined));
  form = form(
    this.#fuleTypeModel,
    (schema) => {
      validateFuelType(schema);
    },
    {
      submission: {
        action: async (f) => {
          this.#dialogRef.close(f().value());
        },
      },
    },
  );
}
