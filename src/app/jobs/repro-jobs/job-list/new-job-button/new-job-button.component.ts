import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-new-job-button',
  templateUrl: './new-job-button.component.html',
  styleUrls: ['./new-job-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewJobButtonComponent {

  @Output() fileList = new EventEmitter<FileList>();

  onFileSelected(event: any) {
    if (event.target?.files instanceof FileList && event.target.files.length > 0) {
      this.fileList.next(event.target.files);
    }
  }

  onFileDrop(fileList: FileList) {
    this.fileList.next(fileList);
  }



}
