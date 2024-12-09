import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PasswordInputGroupComponent } from '../password-input-group/password-input-group.component';
import { MatButtonModule } from '@angular/material/button';

export interface PasswordDialogData {
  minLength?: number;
  validatorFn?: ValidatorFn;
}

@Component({
  selector: 'app-password-input-dialog',
  templateUrl: './password-input-dialog.component.html',
  styleUrls: ['./password-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, PasswordInputGroupComponent],
  standalone: true,
})
export class PasswordInputDialogComponent {
  private data: PasswordDialogData = inject(MAT_DIALOG_DATA);

  passwordControl = new FormControl<string>('', { validators: Validators.required });

  minLength: number | null = this.data.minLength;

  validatorFn: ValidatorFn | null = this.data.validatorFn;
}
