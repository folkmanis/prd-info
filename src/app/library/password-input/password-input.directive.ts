import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { PasswordDialogData, PasswordInputDialogComponent } from './password-input-dialog/password-input-dialog.component';

@Directive({
  selector: 'button[appPasswordInput]'
})
export class PasswordInputDirective {

  @Input('passwordMinimumLength')
  minLength: number | undefined;

  @Input('passwordValidatorFn')
  validatorFn: ValidatorFn | undefined;

  @Output('appPasswordChange')
  passwordEvent = new EventEmitter<string>();

  constructor(
    private dialog: MatDialog,
  ) { }

  @HostListener('click')
  onClick() {
    const config: MatDialogConfig<PasswordDialogData> = {
      data: {
        minLength: this.minLength,
        validatorFn: this.validatorFn,
      }
    };

    this.dialog.open(PasswordInputDialogComponent, config)
      .afterClosed().pipe(
        filter(value => value && typeof value === 'string'),
      )
      .subscribe(value => this.passwordEvent.emit(value));
  }

}
