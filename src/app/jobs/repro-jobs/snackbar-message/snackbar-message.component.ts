import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatLegacySnackBarRef as MatSnackBarRef, MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA } from '@angular/material/legacy-snack-bar';
import { delay, finalize, Observable, of } from 'rxjs';
import { FileUploadMessage, Job } from '../../interfaces';


export interface SnackBarMessageData {
  job?: Job,
  progress: Observable<FileUploadMessage[]>,
  error?: Error,
}

@Component({
  selector: 'app-snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrls: ['./snackbar-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarMessageComponent implements OnInit {

  job: Job | undefined = this.data.job;

  progress$: Observable<FileUploadMessage[]> = this.data.progress || of([]);

  err = this.data.error;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data: SnackBarMessageData,
    private snackbarRef: MatSnackBarRef<SnackbarMessageComponent>,
  ) { }

  ngOnInit(): void {
    this.progress$.pipe(
      delay(3000),
      finalize(() => this.snackbarRef.dismiss()),
    ).subscribe();
  }

  onClose() {
    this.snackbarRef.dismiss();
  }

}
