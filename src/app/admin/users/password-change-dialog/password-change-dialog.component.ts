import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';

@Component({
  selector: 'app-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss']
})
export class PasswordChangeDialogComponent implements OnInit {

  passwordForm = new FormControl(
    '',
    [Validators.required, Validators.minLength(this.params.passwordMinimumLenght)]
  );

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    @Inject(MAT_DIALOG_DATA) public data: { username: string; },
    private dialogRef: MatDialogRef<PasswordChangeDialogComponent>,
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

}
