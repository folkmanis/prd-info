import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ProductCategory } from 'src/app/interfaces';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {

  productForm = new FormGroup({
    category: new FormControl({ value: this.data?.category, disabled: !!this.data }, { validators: Validators.required }),
    description: new FormControl(this.data?.description),
  });

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent, ProductCategory>,
    @Inject(MAT_DIALOG_DATA) private data: ProductCategory,
  ) { }


  onSubmit() {
    this.dialogRef.close(this.productForm.getRawValue());
  }

}
