import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PasswordInputGroupComponent } from '../password-input-group/password-input-group.component';

export interface PasswordDialogData {
  minLength?: number;
  validatorFn?: ValidatorFn;
}

@Component({
  selector: 'app-password-input-dialog',
  templateUrl: './password-input-dialog.component.html',
  styleUrls: ['./password-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, PasswordInputGroupComponent],
  standalone: true,
})
export class PasswordInputDialogComponent {
  private data: PasswordDialogData = inject(MAT_DIALOG_DATA);

  passwordControl = new FormControl<string>('', { validators: Validators.required });

  minLength = this.data.minLength;

  validatorFn = this.data.validatorFn;
}
