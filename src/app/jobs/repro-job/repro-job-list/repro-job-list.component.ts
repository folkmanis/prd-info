import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { concatMap, filter, map, switchMap, tap } from 'rxjs/operators';
import { JobQueryFilter } from 'src/app/interfaces/job';
import { LayoutService } from 'src/app/layout/layout.service';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from '../services/file-upload.service';
import { ReproJobDialogService } from '../services/repro-job-dialog.service';
import { log } from 'prd-cdk';
import { EMPTY, of } from 'rxjs';

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

@Component({
  selector: 'app-repro-job-list',
  templateUrl: './repro-job-list.component.html',
  styleUrls: ['./repro-job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobListComponent implements OnInit {
  large$ = this.layoutService.isLarge$;
  small$ = this.layoutService.isSmall$;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private editDialogService: ReproJobDialogService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => params.get('jobId')),
      filter(jobId => jobId && !isNaN(+jobId)),
      switchMap(jobId => this.jobService.getJob(+jobId)),
      concatMap(job => this.editDialogService.openJob(job).pipe(
        concatMap(data => data ? of(data.job) : EMPTY),
        concatMap(job => this.jobService.updateJob(job))
      )),
    ).subscribe(_ => this.router.navigate(['.'], { relativeTo: this.route }));
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
