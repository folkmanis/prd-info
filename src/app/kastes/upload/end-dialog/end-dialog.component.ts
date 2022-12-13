import { Component, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-end-dialog',
  templateUrl: './end-dialog.component.html',
})
export class EndDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EndDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) { }

}
