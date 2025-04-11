import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input, viewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { configuration } from 'src/app/services/config.provider';
import { FuelType } from 'src/app/transportation/interfaces/fuel-type';
import { FuelPurchase } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { AccordionDirective } from 'src/app/transportation/ui/accordion.directive';
import { FuelTotalsComponent } from '../../../ui/fuel-totals/fuel-totals.component';
import { SinglePurchaseComponent } from './single-purchase/single-purchase.component';
import { isEqual } from 'lodash-es';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { assertArrayOfNotNull } from 'src/app/library';

@Component({
  selector: 'app-fuel-purchases',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SinglePurchaseComponent,
    MatButton,
    FuelTotalsComponent,
    MatExpansionModule,
    DatePipe,
    AccordionDirective,
    MatMenuModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './fuel-purchases.component.html',
  styleUrl: './fuel-purchases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuelPurchasesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FuelPurchasesComponent),
      multi: true,
    },
  ],
})
export class FuelPurchasesComponent implements ControlValueAccessor, Validator {
  private chDetector = inject(ChangeDetectorRef);
  private accordion = viewChild.required(MatAccordion, { read: AccordionDirective });

  private fuelTypes = configuration('transportation', 'fuelTypes');

  startDate = input<Date | null>();

  form = new FormArray<FormControl<FuelPurchase | null>>([]);

  defaultFuelType = input<FuelType>();

  onTouched = () => {};

  fuelDescription = (type: string) => this.fuelTypes()?.find((t) => t.type === type)?.description || '';

  writeValue(obj: FuelPurchase[] | null): void {
    obj = Array.isArray(obj) ? obj : [];
    if (obj.length < this.form.length) {
      this.accordion().closeAll();
    }
    if (obj.length === this.form.length) {
      this.form.reset(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj.forEach((fuelPurchase) => this.form.push(new FormControl(fuelPurchase), { emitEvent: false }));
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      return this.form.controls.reduce((errors, control, idx) => (control.invalid ? { ...errors, [idx]: control.errors } : errors), {});
    }
  }

  onAppend() {
    const purchaseControl = new FormControl(null, [Validators.required]);
    this.form.push(purchaseControl);
    this.onTouched();
    this.chDetector.markForCheck();
    this.accordion().expandLast();
  }

  onRemove(index: number) {
    this.accordion().closeAll();
    this.form.removeAt(index);
    this.onTouched();
    this.chDetector.markForCheck();
  }

  onSortByDate() {
    if (this.form.length < 2 || !this.form.valid) {
      return;
    }

    const value = this.form.value;
    assertArrayOfNotNull(value);
    const update = this.sortByDate(value);
    if (!isEqual(value, update)) {
      this.form.setValue(update);
    }
  }

  private sortByDate(values: FuelPurchase[]): FuelPurchase[] {
    const update = [...values];
    update.sort((a, b) => a.date.getTime() - b.date.getTime());
    return update;
  }
}
