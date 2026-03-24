import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, readonly, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
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
import { ProductCategory } from 'src/app/interfaces';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss'],
  imports: [
    FormField,
    FormRoot,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialogComponent {
  private data = inject<ProductCategory>(MAT_DIALOG_DATA, { optional: true });
  private dialogRef = inject(MatDialogRef);

  #categoryModel = signal<ProductCategory>({
    category: this.data?.category ?? '',
    description: this.data?.description ?? '',
  });
  protected categoryForm = form(
    this.#categoryModel,
    (s) => {
      required(s.category);
      readonly(s.category, () => Boolean(this.data?.category) === true);
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
