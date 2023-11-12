import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { ProductCategory } from 'src/app/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, FormsModule, ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, MatDialogClose]
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
