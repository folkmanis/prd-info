import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      prompt: string;
      title?: string;
      yes?: string;
      no?: string;
    },
  ) { }

  ngOnInit() {
  }

}
