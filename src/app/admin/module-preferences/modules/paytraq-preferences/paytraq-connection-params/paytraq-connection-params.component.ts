import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, effect, forwardRef, inject, output, viewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { PaytraqConnectionParams } from 'src/app/interfaces';

const DEFAULT_VALUE: PaytraqConnectionParams = {
  connectUrl: '',
  connectKey: '',
  apiUrl: '',
  apiKey: '',
  apiToken: '',
  invoiceUrl: '',
};

function isMissingParams(controlValue: Record<string, any>): boolean {
  return Object.keys(controlValue).some((key) => !controlValue[key]);
}

@Component({
  selector: 'app-paytraq-connection-params',
  templateUrl: './paytraq-connection-params.component.html',
  styleUrls: ['./paytraq-connection-params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaytraqConnectionParamsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PaytraqConnectionParamsComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class PaytraqConnectionParamsComponent implements ControlValueAccessor, Validator {
  private containerEl = viewChild.required<HTMLDivElement>('container');
  private onTouched: () => void = () => {};

  controls = inject(FormBuilder).group({
    connectUrl: ['', Validators.required],
    connectKey: ['', Validators.required],
    apiUrl: ['', Validators.required],
    apiKey: ['', Validators.required],
    apiToken: ['', Validators.required],
    invoiceUrl: ['', Validators.required],
  });

  focusInput = output<void>();

  constructor() {
    const focusMonitor = inject(FocusMonitor);

    effect((onCleanup) => {
      const container = this.containerEl();
      focusMonitor.monitor(container, true).subscribe(() => {
        this.onTouched();
        this.focusInput.emit();
      });
      onCleanup(() => {
        focusMonitor.stopMonitoring(container);
      });
    });
  }

  writeValue(obj: PaytraqConnectionParams) {
    this.controls.setValue({ ...DEFAULT_VALUE, ...obj }, { emitEvent: false });
  }

  registerOnChange(fn: (obj: PaytraqConnectionParams) => void) {
    this.controls.valueChanges.pipe(map((value) => (isMissingParams(value) ? null : value))).subscribe(fn);
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.controls.disable({ emitEvent: false });
    } else {
      this.controls.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    const values = this.controls.value;
    if (isMissingParams(values)) {
      return {
        missing: Object.keys(values).filter((key) => !values[key]),
      };
    } else {
      return null;
    }
  }
}
