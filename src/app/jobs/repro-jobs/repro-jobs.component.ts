import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService, log } from 'prd-cdk';
import { combineLatest, concat, EMPTY, merge, Observable, of, Subject, timer } from 'rxjs';
import { concatMap, delay, filter, finalize, last, map, mapTo, mergeMap, pluck, scan, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { UploadFinishMessage, FileUploadEventType, FileUploadMessage, Job, JobQueryFilter } from '../interfaces';
import { LayoutService } from 'src/app/services';
import { JobService } from '../services/job.service';
import { ReproJobDialogService } from './services/repro-job-dialog.service';
import { UserFileUploadService } from './services/user-file-upload.service';

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

    const cancelUpload$ = new Subject<void>();

    const upload$ = this.userFileUpload.upload(Array.from(fileList), cancelUpload$)
      .pipe(
        takeUntil(cancelUpload$),
        shareReplay(1),
      );

    this.progress$ = concat(
      this.messagesAborter(upload$, cancelUpload$),
      timer(5000).pipe(mapTo([]))
    );

    const job: Partial<Job> = this.jobFromFiles(fileList);

    combineLatest({
      jobId: this.editDialogService.openJob(job, upload$).pipe(
        tap(job => !job && cancelUpload$.next()),
        mergeMap(job => this.insertJob(job)),
      ),
      files: upload$.pipe(
        last(),
        map(events => this.uploadEventsToFilenames(events))
      )
    }).pipe(
      mergeMap(({ jobId, files }) => this.addFilesToJob(jobId, files)),
      finalize(() => cancelUpload$.complete())
    ).subscribe();

  }

  private insertJob(job: Partial<Job> | undefined): Observable<number | null> {
    if (!job) {
      return of(null);
    } else {
      return this.jobService.newJob(job);
    }
  }

  private addFilesToJob(jobId: number | null, fileNames: string[]): Observable<number | null> {
    if (!jobId) {
      return this.userFileUpload.deleteUploads(fileNames);
    } else {
      return this.jobService.moveUserFilesToJob(jobId, fileNames).pipe(
        pluck('jobId')
      );
    }
  }

  private uploadEventsToFilenames(events: FileUploadMessage[]): string[] {
    return events
      .filter(event => event.type === FileUploadEventType.UploadFinish)
      .reduce((acc, curr: UploadFinishMessage) => [...acc, ...curr.fileNames], [] as string[]);
  }

  private messagesAborter(messages$: Observable<FileUploadMessage[]>, canceller$: Observable<void>): Observable<FileUploadMessage[]> {
    return merge(messages$, canceller$).pipe(
      scan((acc, messages) => messages || acc.map(msg => ({ ...msg, type: FileUploadEventType.UploadAbort })), []),
      map(messages => messages as FileUploadMessage[]),
    );
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
      concatMap(job => this.insertJob(job)),
    ).subscribe();

  }

  onSetJobStatus({ jobId, jobStatus }: Pick<Job, 'jobId' | 'jobStatus'>) {
    this.jobService.updateJob(jobId, { jobStatus }).subscribe();
  }

  private jobFromFiles(fileList: FileList): Partial<Job> {

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
