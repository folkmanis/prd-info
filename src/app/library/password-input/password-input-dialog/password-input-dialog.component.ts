import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

const MIN_LENGTH = 6;

export interface PasswordDialogData {
  minLength?: number,
  validatorFn?: ValidatorFn,
}

@Component({
  selector: 'app-password-input-dialog',
  templateUrl: './password-input-dialog.component.html',
  styleUrls: ['./password-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputDialogComponent implements OnInit {

  passwordForm: FormGroup;

  hide = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: PasswordDialogData,
  ) { }

  ngOnInit(): void {

    const validators: ValidatorFn[] = [
      Validators.required,
      Validators.minLength(this.data?.minLength ?? MIN_LENGTH),
    ];

    if (typeof this.data?.validatorFn === 'function') {
      validators.push(this.data.validatorFn);
    }

    this.passwordForm = new FormGroup({
      password1: new FormControl(
        null,
        validators
      ),
      password2: new FormControl(
        null,
      )
    },
      {
        validators: equalityValidator()
      });

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
