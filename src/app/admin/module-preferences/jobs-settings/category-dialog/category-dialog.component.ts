import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, readonly, required } from '@angular/forms/signals';
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
import { ProductCategoryModel, ProductCategoryModelSchema } from '../jobs-settings.model';

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
  #data = inject(MAT_DIALOG_DATA, { optional: true });
  #dialogRef = inject(MatDialogRef);

  #categoryModel = signal<ProductCategoryModel>(ProductCategoryModelSchema.parse(this.#data || undefined));
  protected form = form(
    this.#categoryModel,
    (s) => {
      required(s.category);
      required(s.description);
      disabled(s.category, { when: () => Boolean(this.#data?.category) === true });
    },
    {
      submission: {
        action: async (f) => {
          this.#dialogRef.close(f().value());
        },
      },
    },
  );
}
