import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-end-dialog',
  templateUrl: './end-dialog.component.html',
})
export class EndDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EndDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rows: number; }
  ) { }

}
