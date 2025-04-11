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
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter } from 'rxjs';

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
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule],
})
export class SystemPreferencesComponent implements ControlValueAccessor, Validator {
  controls = inject(FormBuilder).group({
    menuExpandedByDefault: [true],
    hostname: ['', Validators.required],
    companyName: ['', Validators.required],
  });

  touch$ = this.controls.events.pipe(
    filter((event) => event instanceof TouchedChangeEvent),
    filter((event) => event.touched),
  );

  writeValue(value: any): void {
    this.controls.patchValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.controls.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touch$.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.controls.disable({ emitEvent: false });
    } else {
      this.controls.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
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
