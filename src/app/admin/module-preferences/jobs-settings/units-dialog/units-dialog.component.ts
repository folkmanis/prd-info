import { Component, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, readonly, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductUnitSchema } from 'src/app/interfaces';
import { ProductUnitModel, ProductUnitModelSchema } from '../jobs-settings.model';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.scss'],
  imports: [
    FormField,
    FormRoot,
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
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  #unitsModel = signal<ProductUnitModel>(ProductUnitModelSchema.parse(this.data || undefined));
  protected form = form(
    this.#unitsModel,
    (s) => {
      required(s.shortName);
      required(s.description);
      disabled(s.shortName, { when: () => Boolean(this.data?.shortName) === true });
    },
    {
      submission: {
        action: async (f) => {
          this.dialogRef.close(f().value());
        },
      },
    },
  );
}
