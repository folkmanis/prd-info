import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import {
  AbstractControl,
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
} from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { filter, firstValueFrom } from 'rxjs';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { LocationSelectService } from 'src/app/library/location-select';

@Component({
  selector: 'app-shipping-address-preferences',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, InputUppercaseDirective, MatIcon, MatIconButton],
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
  private locationSelectService = inject(LocationSelectService);

  form = inject(FormBuilder).nonNullable.group({
    address: ['', [Validators.required]],
    zip: ['', [Validators.required]],
    country: ['LV', [Validators.required]],
    paytraqId: [null as number | null],
    googleId: [null as string | null],
  });

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.form.events
      .pipe(
        filter((event) => event instanceof TouchedChangeEvent),
        filter((event) => event.touched),
      )
      .subscribe(fn);
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

  async onMap() {
    const marker = await firstValueFrom(this.locationSelectService.getLocation(this.form.value));
    if (marker) {
      this.form.patchValue({
        address: marker.address,
        googleId: marker.googleId,
        zip: marker.zip,
        country: marker.country,
      });
    }
  }
}
