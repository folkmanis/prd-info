import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductCategory } from 'src/app/interfaces';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
  imports: [MatDialogTitle, FormsModule, ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, MatDialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialogComponent {
  private data = inject<ProductCategory>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  productForm = inject(FormBuilder).group({
    category: [{ value: this.data?.category, disabled: !!this.data }, Validators.required],
    description: [this.data?.description],
  });

  onSubmit() {
    this.dialogRef.close(this.productForm.getRawValue());
  }
}
