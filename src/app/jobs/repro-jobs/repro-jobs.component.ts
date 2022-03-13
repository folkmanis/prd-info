import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService, log } from 'prd-cdk';
import { combineLatest, concat, EMPTY, from, merge, Observable, of, OperatorFunction, pipe, Subject, timer } from 'rxjs';
import { concatMap, delay, filter, finalize, last, map, mapTo, mergeAll, mergeMap, pluck, scan, share, shareReplay, takeUntil, tap, toArray } from 'rxjs/operators';
import { UploadFinishMessage, FileUploadEventType, FileUploadMessage, Job, JobQueryFilter } from '../interfaces';
import { LayoutService } from 'src/app/services';
import { JobService } from '../services/job.service';
import { ReproJobDialogService } from './services/repro-job-dialog.service';
import { UserFileUploadService } from './services/user-file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  progress$: Observable<FileUploadMessage[]> | null = null;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private editDialogService: ReproJobDialogService,
    private destroy$: DestroyService,
    private router: Router,
    private userFileUpload: UserFileUploadService,
    private snack: MatSnackBar,
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

  onSetJobStatus({ jobId, jobStatus }: Pick<Job, 'jobId' | 'jobStatus'>) {
    this.jobService.updateJob(jobId, { jobStatus }).subscribe();
  }

  onNewJob() {
    const emptyJob = {
      receivedDate: new Date(),
      dueDate: new Date(),
      jobStatus: {
        generalStatus: 10,
        timestamp: new Date(),
      }
    };

    this.editDialogService.openJob(emptyJob).pipe(
      concatMap(job => job ? this.jobService.newJob(job) : EMPTY),
    ).subscribe();

  }

  onFileDrop(fileList: FileList) {

    const uploadRef = this.userFileUpload.userFileUploadRef(Array.from(fileList));

    this.progress$ = concat(
      uploadRef.onMessages(),
      timer(5000).pipe(mapTo([]))
    );


    const job$: Observable<Partial<Job> | null> =
      this.editDialogService.openJob(
        this.jobDataFromFiles(fileList),
        uploadRef.onMessages()
      ).pipe(
        share(),
      );

    job$.pipe(
      filter(job => !job)
    ).subscribe(() => uploadRef.cancel());

    job$.pipe(
      filter(job => !!job),
      mergeMap(job => this.jobService.newJob(job)),
      mergeMap(({ jobId }) => uploadRef.addToJob(jobId)),
      tap(jobId => jobId && this.snack.open('Visi faili pievienoti darbam', 'OK', { duration: 3000 })),
    ).subscribe();

  }

  private jobDataFromFiles(fileList: FileList): Partial<Job> {

    return {
      name: Array.from(fileList)
        .reduce((acc, curr) => [...acc, curr.name.replace(/\.[^/.]+$/, '')], [])
        .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
        .join('_'),
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

  }

}
