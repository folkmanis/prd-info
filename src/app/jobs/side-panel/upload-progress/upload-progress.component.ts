import { Component, OnInit, Input } from '@angular/core';
import { FileUploadMessage, FileUploadEventType } from '../../interfaces/file-upload-message';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.css']
})
export class UploadProgressComponent implements OnInit {
  @Input() set progress(val: FileUploadMessage[] | undefined) {
    if (val) {
      this._progress = [...val];
    }
  }
  get progress(): FileUploadMessage[] { return this._progress; }
  private _progress: FileUploadMessage[] = [];

  types = FileUploadEventType;

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
    return message.type === FileUploadEventType.UploadProgress ? message.precentDone : 0;
  }

  isComplete(message: FileUploadMessage): boolean {
    return message.type === FileUploadEventType.UploadFinish;
  }

}
