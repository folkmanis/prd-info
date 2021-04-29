import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { LayoutService } from 'src/app/layout/layout.service';
import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from '../services/file-upload.service';
import { DestroyService, log } from 'prd-cdk';

const MAX_JOB_NAME_LENGTH = 100;

@Component({
  selector: 'app-repro-job-list',
  templateUrl: './repro-job-list.component.html',
  styleUrls: ['./repro-job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobListComponent implements OnInit {

  editorActive = false;

  large$ = this.layoutService.isLarge$;
  small$ = this.layoutService.isSmall$;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
  }

  onJobFilter(filter: JobQueryFilter) {
    this.jobService.setFilter(filter);
  }

  onFileDrop(fileList: FileList) {
    const fileListArray = Array.from(fileList);
    const name: string = fileListArray
      .reduce((acc, curr) => [...acc, curr.name.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
    this.fileUploadService.setFiles(fileListArray);
    this.router.navigate(['newName', { name }], { relativeTo: this.route });
  }


}
