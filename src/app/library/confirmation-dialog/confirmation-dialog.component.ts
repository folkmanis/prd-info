import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent implements OnInit {

  yes: string;
  no: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      prompt: string;
      yes?: string;
      no?: string;
    },
  ) {   }

ngOnInit() {
  this.yes = this.data.yes || 'Jā!';
  this.no = this.data.no || 'Nē!';
}

}
