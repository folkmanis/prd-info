import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialPrice } from 'src/app/interfaces';

export interface DialogData {
  value: MaterialPrice;
  units: string;
}

@Component({
    selector: 'app-materials-price-dialog',
    templateUrl: './materials-price-dialog.component.html',
    styleUrls: ['./materials-price-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule]
})
export class MaterialsPriceDialogComponent {
  private value: MaterialPrice = this.data.value;
  priceControl = new FormGroup({
    min: new FormControl<number>(this.value.min, [Validators.required, Validators.min(0)]),
    price: new FormControl<number>(this.value.price, [Validators.required, Validators.min(0)]),
    description: new FormControl<string>(this.value.description),
  });

  units: string = this.data.units;

  constructor(@Inject(MAT_DIALOG_DATA) private data: DialogData) {}
}
