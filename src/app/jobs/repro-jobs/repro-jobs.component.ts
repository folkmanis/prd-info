import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { EMPTY, Observable, of } from 'rxjs';
import { concatMap, filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Job, JobQueryFilter } from '../interfaces';
import { LayoutService } from 'src/app/services';
import { JobService } from '../services/job.service';
import { FileUploadService } from './services/file-upload.service';
import { ReproJobDialogService } from './services/repro-job-dialog.service';

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

@Component({
  selector: 'app-repro-jobs',
  templateUrl: './repro-jobs.component.html',
  styleUrls: ['./repro-jobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobsComponent implements OnInit {

  large$ = this.layoutService.isLarge$;
  small$ = this.layoutService.isSmall$;

  jobs$ = this.jobService.jobs$;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private editDialogService: ReproJobDialogService,
    private destroy$: DestroyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => params.get('jobId')),
      filter(jobId => jobId && !isNaN(+jobId)),
      concatMap(jobId => this.editDialogService.editJob(+jobId)),
      takeUntil(this.destroy$),
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
    const job: Partial<Job> = {
      name,
      receivedDate: new Date(),
      dueDate: new Date(),
      production: {
        category: 'repro',
      },
      jobStatus: {
        generalStatus: 20,
        timestamp: new Date(),
      },
    };
    this.editDialogService.openJob(job).pipe(
      mergeMap(data => this.insertJobAndUploadFiles(data)),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  onNewJob() {
    const job = {
      receivedDate: new Date(),
      dueDate: new Date(),
      jobStatus: {
        generalStatus: 10,
        timestamp: new Date(),
      }
    };

    this.editDialogService.openJob(job).pipe(
      concatMap(job => this.insertJobAndUploadFiles(job)),
      takeUntil(this.destroy$),
    ).subscribe();

  }

  onSetJobStatus({ jobId, jobStatus }: Pick<Job, 'jobId' | 'jobStatus'>) {
    this.jobService.updateJob(jobId, { jobStatus }).subscribe();
  }


  private insertJobAndUploadFiles(job: Partial<Job> | undefined): Observable<number | never> {
    if (!job) {
      this.fileUploadService.clearUploadQueue();
      return EMPTY;
    }
    return this.jobService.newJob(job).pipe(
      mergeMap(jobId => this.fileUploadService.startUpload(jobId)),
    );
  }


}
