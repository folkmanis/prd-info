import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileUploadEventType, FileUploadMessage } from '../../interfaces/file-upload-message';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgFor, NgSwitch, NgSwitchCase, NgIf } from '@angular/common';

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
    ],
    standalone: true,
    imports: [NgFor, MatProgressBarModule, NgSwitch, NgSwitchCase, NgIf, MatDividerModule]
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
