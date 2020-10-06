import { Component, OnInit, Input } from '@angular/core';
import { FileUploadMessage, FileUploadEventType } from '../../interfaces/file-upload-message';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.css']
})
export class UploadProgressComponent implements OnInit {
  @Input() progress: FileUploadMessage[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  trackByFn(_: number, progr: FileUploadMessage): string {
    return progr.id + progr.type;
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
