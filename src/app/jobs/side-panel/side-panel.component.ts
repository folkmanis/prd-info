import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntil, tap, map } from 'rxjs/operators';
import { JobEditDialogService } from '../job-edit';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { FileUploadService } from '../services/file-upload.service';

const MAX_JOB_NAME_LENGTH = 100;

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnInit {

  constructor(
    private jobDialog: JobEditDialogService,
    private destroy$: DestroyService,
    private fileUploadService: FileUploadService,
  ) { }

  progress$ = this.fileUploadService.uploadProgress$;

  ngOnInit(): void {
  }

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
