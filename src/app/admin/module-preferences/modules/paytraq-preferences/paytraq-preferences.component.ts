import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { map } from 'rxjs/operators';
import { PaytraqConnectionParams } from 'src/app/interfaces';
import { PaytraqConnectionParamsComponent } from './paytraq-connection-params/paytraq-connection-params.component';

@Component({
  selector: 'app-paytraq-preferences',
  templateUrl: './paytraq-preferences.component.html',
  styleUrls: ['./paytraq-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaytraqPreferencesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PaytraqPreferencesComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule, MatDividerModule, PaytraqConnectionParamsComponent],
})
export class PaytraqPreferencesComponent implements ControlValueAccessor, Validator {
  onTouchFn = () => {};

  controls = inject(FormBuilder).group({
    enabled: [false],
    connectionParams: [null as null | PaytraqConnectionParams],
  });

  writeValue(obj: any): void {
    this.controls.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.controls.valueChanges.pipe(map((values) => (values.enabled ? values : { enabled: false, connectionParams: null }))).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.controls.disable({ emitEvent: false });
    } else {
      this.controls.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    if (!this.controls.value.enabled || this.controls.valid) {
      return null;
    } else {
      return {
        connectionParams: 'No set',
      };
    }
  }
}
