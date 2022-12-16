import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
})
export class MaterialsPriceDialogComponent implements OnInit {

  priceControl = new FormGroup({
    min: new FormControl<number>(
      0,
      [Validators.required, Validators.min(0)],
    ),
    price: new FormControl<number>(
      0,
      [Validators.required, Validators.min(0)],
    ),
    description: new FormControl<string>(null),
  });

  units = this.data.units;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
  ) { }


  ngOnInit(): void {
    this.priceControl.reset(this.data.value, { emitEvent: false });
  }

}
