import { Component, OnInit, Input } from '@angular/core';
import { FileUploadMessage, FileUploadEventType } from '../../interfaces/file-upload-message';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.css'],
  animations: [
    trigger('collapseAnimation', [

      transition(':enter', [
        style({ height: 0 }),
        animate('500ms', style({ height: '*' }))
      ]),

      transition(':leave', [
        animate('500ms', style({ height: 0 }))
      ]),
    ])
  ]
})
export class UploadProgressComponent implements OnInit {
  @Input() progress: FileUploadMessage[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  trackByFn(_: number, progr: FileUploadMessage): string {
    return progr.id;
  }

  isProgress(message: FileUploadMessage): boolean {
    return message.type === FileUploadEventType.UploadProgress;
  }

  progressPercent(message: FileUploadMessage): number {
    switch (message.type) {
      case FileUploadEventType.UploadProgress:
        return message.precentDone;
      case FileUploadEventType.UploadFinish:
        return 100;
      default:
        return 0;
    }
  }

  isComplete(message: FileUploadMessage): boolean {
    return message.type === FileUploadEventType.UploadFinish;
  }

  isWaiting(message: FileUploadMessage): boolean {
    return message.type === FileUploadEventType.UploadWaiting;
  }

}
