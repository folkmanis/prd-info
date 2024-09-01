import { ChangeDetectionStrategy, Component, effect, forwardRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { isFinite } from 'lodash-es';
import { map, merge } from 'rxjs';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { FuelType } from 'src/app/transportation/interfaces/fuel-type';

@Component({
  selector: 'app-single-purchase',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput, MatDatepickerModule, MatSelect, MatOption, ViewSizeDirective],
  templateUrl: './single-purchase.component.html',
  styleUrl: './single-purchase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SinglePurchaseComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SinglePurchaseComponent),
      multi: true,
    },
  ],
})
export class SinglePurchaseComponent implements ControlValueAccessor, Validator {
  form = inject(FormBuilder).group({
    date: [null as Date | null, [Validators.required]],
    type: [null as string | null, [Validators.required]],
    units: [null as string | null, [Validators.required]],
    amount: [null as null | number, [Validators.required, Validators.min(0)]],
    price: [null as null | number, [Validators.required]],
    total: [null as null | number, [Validators.required, Validators.min(0)]],
    invoiceId: [null as null | string],
  });

  fuelTypes = configuration('transportation', 'fuelTypes');

  defaultFuelType = input<FuelType>();

  onTouched = () => {};

  constructor() {
    merge(this.form.controls.amount.valueChanges, this.form.controls.price.valueChanges)
      .pipe(
        map(() => [this.form.controls.amount.value, this.form.controls.price.value]),
        map(([amount, price]) => (isFinite(amount) && isFinite(price) ? round(amount * price, 2) : null)),
        takeUntilDestroyed(),
      )
      .subscribe((total) => this.form.controls.total.setValue(total));

    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe((type) => this.setUnits(type));

    effect(() => {
      const type = this.defaultFuelType()?.type;
      if (!this.form.value.type && type) {
        this.form.patchValue({ type });
      }
    });
  }

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
    if (!obj?.type && this.defaultFuelType()) {
      this.form.patchValue({ type: this.defaultFuelType()?.type });
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      return Object.entries(this.form.controls).reduce(
        (acc, [key, control]) => ({
          ...acc,
          ...(control.invalid ? { [key]: control.errors } : {}),
        }),
        {},
      );
    }
  }

  private setUnits(type: string) {
    const units = this.fuelTypes().find((fuelType) => fuelType.type === type)?.units;
    units && this.form.controls.units.setValue(units);
  }
}

function round(num: number, decimalPlaces = 0) {
  const p = Math.pow(10, decimalPlaces);
  const n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}
