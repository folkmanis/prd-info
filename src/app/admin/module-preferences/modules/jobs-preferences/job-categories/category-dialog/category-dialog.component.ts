import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobsSettings, ProductCategory } from 'src/app/interfaces';
import { IFormBuilder, IControlValueAccessor, IFormArray, IFormGroup } from '@rxweb/types';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ProductCategory,
  ) { }

  productForm = new FormGroup({
    category: new FormControl({ value: this.data?.category, disabled: this.data }, { validators: Validators.required }),
    description: new FormControl(this.data?.description),
  }) as IFormGroup<ProductCategory>;

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close(this.productForm.value);
  }

}
