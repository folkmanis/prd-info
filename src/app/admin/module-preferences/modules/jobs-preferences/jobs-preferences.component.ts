import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ProductCategory, ProductUnit } from 'src/app/interfaces';
import { SimpleListTableComponent } from 'src/app/library/simple-list-table/simple-list-table.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { UnitsDialogComponent } from './units-dialog/units-dialog.component';

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JobsPreferencesComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SimpleListTableComponent],
})
export class JobsPreferencesComponent implements ControlValueAccessor {
  controls = inject(FormBuilder).group({
    productCategories: [[]] as Array<ProductCategory[]>,
    productUnits: [[]] as Array<ProductUnit[]>,
  });

  onTouchFn = () => {};

  categoryDialog = CategoryDialogComponent;
  unitsDialog = UnitsDialogComponent;

  writeValue(obj: any): void {
    this.controls.patchValue(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.controls.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.controls.disable();
    } else {
      this.controls.enable();
    }
  }
}
