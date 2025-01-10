import { ChangeDetectionStrategy, Component, effect, forwardRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  ValidationErrors,
  Validator,
  Validators,
  ValueChangeEvent,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { isFinite, round } from 'lodash-es';
import { filter } from 'rxjs';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { FuelType } from 'src/app/transportation/interfaces/fuel-type';
import { FuelPurchase } from 'src/app/transportation/interfaces/transportation-route-sheet';

@Component({
  selector: 'app-single-purchase',
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

  startDate = input<Date>();

  onTouched = () => {};

  constructor() {
    this.form.events
      .pipe(
        filter((event) => event instanceof ValueChangeEvent),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.updateTotal(event));

    this.form.events
      .pipe(
        filter((event) => event instanceof TouchedChangeEvent && event.touched),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.onTouched());

    this.form.controls.type.valueChanges.pipe(takeUntilDestroyed()).subscribe((type) => this.setUnits(type));

    effect(() => {
      const type = this.defaultFuelType()?.type;
      if (!this.form.value.type && type) {
        this.form.patchValue({ type });
      }
    });
  }

  writeValue(obj: any): void {
    const purchase = obj ?? new FuelPurchase(this.defaultFuelType());
    this.form.reset(purchase, { emitEvent: false });
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

  private updateTotal(event: ValueChangeEvent<FuelPurchase>) {
    const {
      value: { amount, price, total },
    } = event;
    const update = isFinite(amount) && isFinite(total) && amount > 0 ? round(total / amount, 3) : null;
    if (update !== price) {
      this.form.controls.price.setValue(update);
    }
  }
}
