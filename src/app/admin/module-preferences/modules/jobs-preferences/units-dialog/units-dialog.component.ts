import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, readonly, required } from '@angular/forms/signals';
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
import { ProductUnit } from 'src/app/interfaces';

@Component({
  selector: 'app-units-dialog',
  templateUrl: './units-dialog.component.html',
  styleUrls: ['./units-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private data = inject<ProductUnit>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  #unitsModel = signal<ProductUnit>({
    shortName: this.data?.shortName ?? '',
    description: this.data?.description ?? '',
    disabled: this.data?.disabled ?? false,
  });
  protected unitsForm = form(
    this.#unitsModel,
    (s) => {
      required(s.shortName);
      readonly(s.shortName, () => Boolean(this.data?.shortName) === true);
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
