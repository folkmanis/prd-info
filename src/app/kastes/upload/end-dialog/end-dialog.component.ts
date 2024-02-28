import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  templateUrl: './end-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
})
export class EndDialogComponent {

  count: number = inject(MAT_DIALOG_DATA);

}
