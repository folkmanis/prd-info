import { Component, OnInit, Input } from '@angular/core';
import { FileUploadMessage, FileUploadEventType } from '../../../interfaces/file-upload-message';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss'],
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

  progress$ = this.fileUploadService.uploadProgress$;

  constructor(
    private fileUploadService: FileUploadService,
  ) { }

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
