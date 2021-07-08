import { Inject, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialsFormSource } from '../../services/materials-form-source';

export interface DialogData {
  control: FormGroup;
  units: string;
}

@Component({
  selector: 'app-materials-price-dialog',
  templateUrl: './materials-price-dialog.component.html',
  styleUrls: ['./materials-price-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsPriceDialogComponent implements OnInit {

  priceControl = this.data.control;
  units = this.data.units;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<MaterialsPriceDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

}
