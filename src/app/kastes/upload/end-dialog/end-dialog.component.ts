import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './end-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndDialogComponent {

  count: number = this.data;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: number,
  ) { }

}
