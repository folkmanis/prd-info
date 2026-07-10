import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ExpressionInputDirective } from 'prd-cdk';
import { MaterialPriceModel } from '../../schemas/material-model.schema';
import { materialPrice } from '../materials-prices/validate-materials-price';

export interface DialogData {
  value: MaterialPriceModel;
  units: string;
}

@Component({
  selector: 'app-materials-price-dialog',
  templateUrl: './materials-price-dialog.component.html',
  styleUrls: ['./materials-price-dialog.component.scss'],
  imports: [
    FormField,
    ExpressionInputDirective,
    FormRoot,
    MatDialogModule, MatFormFieldModule, MatButton, MatInput],
})
export class MaterialsPriceDialogComponent {
  #data = inject<DialogData>(MAT_DIALOG_DATA);
  #dialogRef = inject(MatDialogRef);

  protected units: string = this.#data.units;

  #formModel = signal(this.#data.value);
  protected form = form(this.#formModel, (schema) => {
    materialPrice(schema);
  }, {
    submission: {
      action: async (f) => {
        if (f().valid()) {
          this.#dialogRef.close(f().value());
        }
      }
    }
  });

}
