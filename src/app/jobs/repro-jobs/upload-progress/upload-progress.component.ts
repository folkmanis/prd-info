import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadEventType, FileUploadMessage } from '../../interfaces/file-upload-message';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapseAnimation', [
      transition(':enter', [style({ height: 0 }), animate('200ms', style({ height: '*' }))]),
      transition(':leave', [animate('200ms', style({ height: 0 }))]),
    ]),
  ],
  imports: [MatProgressBarModule, MatDividerModule],
})
export class UploadProgressComponent {
  readonly types = FileUploadEventType;

  progress = input<FileUploadMessage[] | null>([]);

  progressPercent(message: FileUploadMessage): number {
    switch (message.type) {
      case FileUploadEventType.UploadProgress:
        return message.percentDone;
      case FileUploadEventType.UploadFinish:
        return 100;
      default:
        return 0;
    }
  }
}
