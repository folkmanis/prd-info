import { Component, OnInit } from '@angular/core';
import { JobEditDialogService } from '../job-edit';

const MAX_JOB_NAME_LENGTH = 100;

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  constructor(
    private jobDialog: JobEditDialogService,
  ) { }

  ngOnInit(): void {
  }

  onFileDrop(fileList: FileList | any) {
    if (!(fileList instanceof FileList) || !fileList.length) { return; }

    const names: string[] = [];
    // const formData = new FormData();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < fileList.length; i++) {
      names.push(fileList[i].name.replace(/\.[^/.]+$/, ''));
      // formData.append(`file${i}`, event[i], event[i].name);
    }
    const name = names
      .reduce((acc, curr) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
    this.jobDialog.newJob({ name }, fileList).subscribe();
  }

}
