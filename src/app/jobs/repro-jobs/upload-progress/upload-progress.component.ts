import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileUploadEventType, FileUploadMessage } from '../../interfaces/file-upload-message';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapseAnimation', [

      transition(':enter', [
        style({ height: 0 }),
        animate('200ms', style({ height: '*' }))
      ]),

      transition(':leave', [
        animate('200ms', style({ height: 0 }))
      ]),
    ])
  ]
})
export class UploadProgressComponent {

  readonly types = FileUploadEventType;

  @Input() progress: FileUploadMessage[] = [];


  trackByFn = (_: number, progr: FileUploadMessage): string => progr.id;

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
