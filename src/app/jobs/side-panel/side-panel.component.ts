import { Component, ChangeDetectionStrategy } from '@angular/core';
import { JobEditDialogService } from '../job-edit';
import { FileUploadService } from '../services/file-upload.service';

const MAX_JOB_NAME_LENGTH = 100;

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent  {

  constructor(
    private jobDialog: JobEditDialogService,
    private fileUploadService: FileUploadService,
  ) { }

  progress$ = this.fileUploadService.uploadProgress$;

  onFileDrop(fileList: FileList | any) {
    if (!(fileList instanceof FileList) || !fileList.length) { return; }
    const fileListArray = Array.from(fileList);
    const name: string = fileListArray
      .reduce((acc, curr) => [...acc, curr.name.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
    this.jobDialog.newJob({ name, category: 'repro' }, fileListArray).subscribe();
  }

}
