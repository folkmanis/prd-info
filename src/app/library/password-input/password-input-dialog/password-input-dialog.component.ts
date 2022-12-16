import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


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

  passwordControl = new FormControl<string>('');

  minLength: number | null;

  validatorFn: ValidatorFn | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: PasswordDialogData,
  ) { }

  ngOnInit(): void {
    this.minLength = this.data.minLength;
    this.validatorFn = this.data.validatorFn;
  }
}
