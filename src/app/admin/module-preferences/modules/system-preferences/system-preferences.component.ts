import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShippingAddress } from 'src/app/interfaces';
import { ShippingAddressPreferencesComponent } from './shipping-address-preferences/shipping-address-preferences.component';

@Component({
  selector: 'app-system-preferences',
  templateUrl: './system-preferences.component.html',
  styleUrls: ['./system-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SystemPreferencesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SystemPreferencesComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, ShippingAddressPreferencesComponent],
})
export class SystemPreferencesComponent implements ControlValueAccessor, Validator {
  controls = inject(FormBuilder).group({
    menuExpandedByDefault: [true],
    hostname: ['', Validators.required],
    shippingAddress: [null as null | ShippingAddress],
  });

  onTouchFn = () => {};

  writeValue(value: any): void {
    this.controls.patchValue(value, { emitEvent: false });
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

  validate(): ValidationErrors {
    if (this.controls.valid) {
      return null;
    } else {
      return Object.entries(this.controls.controls).reduce(
        (acc, [key, control]) => ({
          ...acc,
          ...(control.invalid ? { [key]: control.errors } : {}),
        }),
        {},
      );
    }
  }
}
