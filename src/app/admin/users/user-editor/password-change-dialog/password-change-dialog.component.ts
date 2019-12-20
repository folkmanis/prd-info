import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.css']
})
export class PasswordChangeDialogComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) data: { username: string; };
  passwordForm = new FormGroup({
    password: new FormControl(),
    password2: new FormControl(),
  });
  constructor(
    private dialogRef: MatDialogRef<PasswordChangeDialogComponent>
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }
  // TODO validators
}
