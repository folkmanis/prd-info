import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup } from '@rxweb/types';
import { ProductCategory } from 'src/app/interfaces';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {

  productForm = new UntypedFormGroup({
    category: new UntypedFormControl({ value: this.data?.category, disabled: this.data }, { validators: Validators.required }),
    description: new UntypedFormControl(this.data?.description),
  }) as IFormGroup<ProductCategory>;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent, ProductCategory>,
    @Inject(MAT_DIALOG_DATA) private data: ProductCategory,
  ) { }


  onSubmit() {
    this.dialogRef.close(this.productForm.value);
  }

}
