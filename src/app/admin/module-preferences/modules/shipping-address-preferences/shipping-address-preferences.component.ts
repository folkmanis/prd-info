import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';

@Component({
  selector: 'app-shipping-address-preferences',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, InputUppercaseDirective],
  templateUrl: './shipping-address-preferences.component.html',
  styleUrl: './shipping-address-preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShippingAddressPreferencesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ShippingAddressPreferencesComponent),
      multi: true,
    },
  ],
})
export class ShippingAddressPreferencesComponent implements ControlValueAccessor, Validator {
  private destroyRef = inject(DestroyRef);

  form = inject(FormBuilder).nonNullable.group({
    address: ['', [Validators.required]],
    zip: ['', [Validators.required]],
    country: ['LV', [Validators.required]],
    paytraqId: [null as number | null],
    googleId: [null as string | null],
  });

  onTouched = () => {};

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(fn);
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

  validate(_: AbstractControl): ValidationErrors | null {
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
