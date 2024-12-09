import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
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
} from '@angular/forms';
import { filter } from 'rxjs';
import { FuelTypeInterface, ShippingAddress } from 'src/app/interfaces';
import { ShippingAddressPreferencesComponent } from './shipping-address-preferences/shipping-address-preferences.component';
import { SimpleListTableComponent } from 'src/app/library/simple-list-table/simple-list-table.component';
import { FuelTypeDialogComponent } from './fuel-type-dialog/fuel-type-dialog.component';

@Component({
  selector: 'app-transportation-preferences',
  imports: [FormsModule, ReactiveFormsModule, ShippingAddressPreferencesComponent, SimpleListTableComponent],
  templateUrl: './transportation-preferences.component.html',
  styleUrl: './transportation-preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TransportationPreferencesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TransportationPreferencesComponent),
      multi: true,
    },
  ],
})
export class TransportationPreferencesComponent implements ControlValueAccessor, Validator {
  form = inject(FormBuilder).group({
    shippingAddress: [null as null | ShippingAddress],
    fuelTypes: [[] as FuelTypeInterface[]],
  });

  touch$ = this.form.events.pipe(
    filter((event) => event instanceof TouchedChangeEvent),
    filter((event) => event.touched),
  );

  fuelTypeDialog = FuelTypeDialogComponent;

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touch$.subscribe(fn);
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
}
