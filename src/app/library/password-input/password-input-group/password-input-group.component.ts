import { A11yModule } from '@angular/cdk/a11y';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
  standalone: true,
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
export class PasswordInputGroupComponent implements OnInit, ControlValueAccessor, Validator {
  hide = true;

  passwordForm = new FormGroup(
    {
      password1: new FormControl<string>(null),
      password2: new FormControl<string>(null),
    },
    {
      validators: equalityValidator(),
    },
  );

  onTouchFn: () => void = () => {};

  private _validatorFn: ValidatorFn | null;
  @Input('passwordValidatorFn') set validatorFn(value: ValidatorFn) {
    this._validatorFn = value;
    this.setValidators();
  }
  get validatorFn() {
    return this._validatorFn;
  }

  private _minLength = MIN_LENGTH;
  @Input('passwordMinimumLength') set minLength(value: number) {
    value = coerceNumberProperty(value);
    if (isNaN(value) || value < 1) {
      value = MIN_LENGTH;
    }
    this._minLength = value;
    this.setValidators();
  }
  get minLength() {
    return this._minLength;
  }

  constructor() {}

  writeValue(): void {
    this.passwordForm.reset();
  }

  registerOnChange(fn: any): void {
    this.passwordForm.valueChanges.pipe(map((val) => val.password1)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.passwordForm.disable();
    } else {
      this.passwordForm.enable();
    }
  }

  validate(): ValidationErrors {
    return this.passwordForm.errors;
  }

  ngOnInit(): void {
    this.setValidators();
  }

  private setValidators() {
    const validators: ValidatorFn[] = [Validators.required, Validators.minLength(this.minLength)];

    if (typeof this.validatorFn === 'function') {
      validators.push(this.validatorFn);
    }
    this.passwordForm.controls.password1.setValidators(validators);
  }
}

function equalityValidator(): ValidatorFn {
  return (control: FormGroup) => {
    const isEqual = control.value.password1 === control.value.password2;
    const error = !isEqual ? { notEqual: 'Parolēm jāsakrīt' } : null;
    control.controls.password2.setErrors(error);
    return error;
  };
}
