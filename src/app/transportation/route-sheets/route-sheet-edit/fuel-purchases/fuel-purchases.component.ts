import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  Validators
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { isObject } from 'lodash-es';
import { FuelType } from 'src/app/transportation/interfaces/fuel-type';
import { FuelPurchase } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { SinglePurchaseComponent } from './single-purchase/single-purchase.component';
import { FuelPurchaseTotals, TotalAmountComponent } from './total-amount/total-amount.component';

@Component({
  selector: 'app-fuel-purchases',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SinglePurchaseComponent, MatDivider, MatButton, TotalAmountComponent],
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
  form = new FormArray<FormControl<FuelPurchase>>([]);

  defaultFuelType = input<FuelType>();

  totals = signal<FuelPurchaseTotals | null>(null);

  onTouched = () => {};

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.setTotalFuelPurchase(value));
  }

  writeValue(obj: FuelPurchase[] | null): void {
    if (obj?.length === this.form.length) {
      this.form.reset(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj?.forEach((fuelPurchase) => this.form.push(new FormControl(fuelPurchase), { emitEvent: false }));
    }
    this.setTotalFuelPurchase(obj);
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
      return this.form.controls.filter((control) => control.invalid).map((control) => control.errors);
    }
  }

  onAppend() {
    const purchaseControl = new FormControl(null, [Validators.required]);
    this.form.push(purchaseControl);
    this.onTouched();
  }

  onRemove(index: number) {
    this.form.removeAt(index);
    this.onTouched();
  }

  private setTotalFuelPurchase(fuelPurchases: FuelPurchase[] | null) {
    const totals = { amount: 0, total: 0, units: this.defaultFuelType()?.units || '' };
    const validPurchases = fuelPurchases?.filter(isObject);
    if (validPurchases) {
      validPurchases.forEach((fuelPurchase) => {
        totals.amount += fuelPurchase.amount;
        totals.total += fuelPurchase.total;
      });
      const purchasesUnits = [...new Set(validPurchases.map((fuelPurchase) => fuelPurchase.units))].join(',');
      totals.units = purchasesUnits || this.defaultFuelType()?.units || '';
    }
    this.totals.set(totals);
  }
}
