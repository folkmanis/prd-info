import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Observable, delay, finalize, of } from 'rxjs';
import { FileUploadMessage, Job } from '../../interfaces';
import { UploadProgressComponent } from '../upload-progress/upload-progress.component';

export interface SnackBarMessageData {
  job?: Job;
  progress: Observable<FileUploadMessage[]>;
  error?: Error;
}

@Component({
  selector: 'app-snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrls: ['./snackbar-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, UploadProgressComponent, AsyncPipe],
})
export class SnackbarMessageComponent implements OnInit {
  job: Job | undefined = this.data.job;

  progress$: Observable<FileUploadMessage[]> = this.data.progress || of([]);

  err = this.data.error;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data: SnackBarMessageData,
    private snackbarRef: MatSnackBarRef<SnackbarMessageComponent>
  ) {}

  ngOnInit(): void {
    this.progress$
      .pipe(
        delay(3000),
        finalize(() => this.snackbarRef.dismiss())
      )
      .subscribe();
  }

  onClose() {
    this.snackbarRef.dismiss();
  }
}
