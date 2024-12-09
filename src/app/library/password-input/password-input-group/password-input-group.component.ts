import { A11yModule } from '@angular/cdk/a11y';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, input, Input, numberAttribute, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';

const MIN_LENGTH = 6;

@Component({
  selector: 'app-password-input-group',
  templateUrl: './password-input-group.component.html',
  styleUrls: ['./password-input-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, A11yModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PasswordInputGroupComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordInputGroupComponent,
      multi: true,
    },
  ],
})
export class PasswordInputGroupComponent implements ControlValueAccessor, Validator, OnChanges {
  hide = true;

  passwordForm = new FormGroup(
    {
      password: new FormControl<string>(null),
      confirmation: new FormControl<string>(null),
    },
    {
      validators: equalityValidator(),
    },
  );

  onTouchFn: () => void = () => {};

  passwordValidatorFn = input<ValidatorFn>();

  passwordMinimumLength = input(MIN_LENGTH, { transform: numberAttribute });

  ngOnChanges(): void {
    this.setValidators();
  }

  writeValue(value: any): void {
    this.passwordForm.reset({ password: value, confirmation: value }, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.passwordForm.valueChanges.subscribe((value) => fn(value.password));
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.passwordForm.disable({ emitEvent: false });
    } else {
      this.passwordForm.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    return this.passwordForm.valid ? null : { invalid: 'password invalid' };
  }

  private setValidators() {
    const validators: ValidatorFn[] = [Validators.required, Validators.minLength(this.passwordMinimumLength())];

    if (typeof this.passwordValidatorFn() === 'function') {
      validators.push(this.passwordValidatorFn());
    }

    this.passwordForm.controls.password.setValidators(validators);
  }
}

function equalityValidator(): ValidatorFn {
  return (control: FormGroup) => {
    const isEqual = control.value.password === control.value.confirmation;
    const error = !isEqual ? { notEqual: true } : null;
    control.controls.confirmation.setErrors(error);
    return error;
  };
}
