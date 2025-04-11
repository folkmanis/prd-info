import { Directive, inject, input, output } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { PasswordDialogData, PasswordInputDialogComponent } from './password-input-dialog/password-input-dialog.component';

@Directive({
  selector: 'button[appPasswordInput]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class PasswordInputDirective {
  private dialog = inject(MatDialog);

  minLength = input<number | null>(null, { alias: 'passwordMinimumLength' });

  validatorFn = input<ValidatorFn | null>(null, { alias: 'passwordValidatorFn' });

  passwordEvent = output<string>({ alias: 'appPasswordChange' });

  onClick() {
    const config: MatDialogConfig<PasswordDialogData> = {
      data: {
        minLength: this.minLength() || undefined,
        validatorFn: this.validatorFn,
      },
    };

    this.dialog
      .open(PasswordInputDialogComponent, config)
      .afterClosed()
      .pipe(filter((value) => value && typeof value === 'string'))
      .subscribe((value) => this.passwordEvent.emit(value));
  }
}
