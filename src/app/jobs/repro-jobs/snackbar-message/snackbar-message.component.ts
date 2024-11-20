import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { delay, finalize, Observable, of } from 'rxjs';
import { FileUploadMessage } from '../../interfaces';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';

export interface SnackBarMessageData {
  jobId?: number;
  name?: string;
  progress: Observable<FileUploadMessage[]>;
  error?: Error;
}

@Component({
    selector: 'app-snackbar-message',
    templateUrl: './snackbar-message.component.html',
    styleUrls: ['./snackbar-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, UploadProgressComponent, AsyncPipe]
})
export class SnackbarMessageComponent {
  private data = inject<SnackBarMessageData>(MAT_SNACK_BAR_DATA);
  private snackbarRef = inject<MatSnackBarRef<SnackbarMessageComponent>>(MatSnackBarRef);

  jobId = this.data.jobId;
  name = this.data.name;

  progress$: Observable<FileUploadMessage[]> = this.data.progress || of([]);

  err = this.data.error;

  constructor() {
    this.progress$
      .pipe(
        delay(3000),
        finalize(() => this.snackbarRef.dismiss()),
      )
      .subscribe();
  }

  onClose() {
    this.snackbarRef.dismiss();
  }
}
