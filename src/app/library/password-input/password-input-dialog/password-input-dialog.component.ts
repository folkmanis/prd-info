import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PasswordInputGroupComponent } from '../password-input-group/password-input-group.component';
import { MatButtonModule } from '@angular/material/button';

export interface PasswordDialogData {
  minLength?: number;
  validatorFn?: ValidatorFn;
}

@Component({
  selector: 'app-password-input-dialog',
  standalone: true,
  templateUrl: './password-input-dialog.component.html',
  styleUrls: ['./password-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, PasswordInputGroupComponent],
})
export class PasswordInputDialogComponent implements OnInit {
  passwordControl = new FormControl<string>('');

  minLength: number | null;

  validatorFn: ValidatorFn | null;

  constructor(@Inject(MAT_DIALOG_DATA) private data: PasswordDialogData) {}

  ngOnInit(): void {
    this.minLength = this.data.minLength;
    this.validatorFn = this.data.validatorFn;
  }
}
