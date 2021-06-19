import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { concatMap, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { JobQueryFilter } from 'src/app/interfaces/job';
import { LayoutService } from 'src/app/layout/layout.service';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from './services/file-upload.service';
import { ReproJobDialogService } from './services/repro-job-dialog.service';
import { log } from 'prd-cdk';
import { EMPTY, Observable, of, pipe } from 'rxjs';
import { JobBase } from 'src/app/interfaces';
import { endOfDay } from 'date-fns';

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

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
    private editDialogService: ReproJobDialogService,
    private destroy$: DestroyService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => params.get('jobId')),
      filter(jobId => jobId && !isNaN(+jobId)),
      switchMap(jobId => this.jobService.getJob(+jobId)),
      concatMap(job => this.editDialogService.openJob(job).afterClosed().pipe(
        tap(_ => this.location.back()),
        concatMap(data => data ? of(data.job) : EMPTY),
        concatMap(job => this.updateJob(job))
      )),
      takeUntil(this.destroy$),
    ).subscribe();
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
    const job: Partial<JobBase> = {
      name,
      category: 'repro',
      jobStatus: {
        generalStatus: 20
      },
    };
    this.editDialogService.openJob(job).afterClosed().pipe(
      concatMap(data => {
        if (data) {
          return of(data.form.value).pipe(
            concatMap(job => this.insertJobAndUploadFiles(job)),
          );
        } else {
          this.fileUploadService.clearUploadQueue();
          return EMPTY;
        }
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  onNewJob(job: Partial<JobBase> = {}) {
    this.editDialogService.openJob(job).afterClosed().pipe(
      concatMap(data => data ? of(data.job) : EMPTY),
      concatMap(job => this.insertJobAndUploadFiles(job)),
      takeUntil(this.destroy$),
    ).subscribe();

  }

  private updateJob(job: Partial<JobBase>): Observable<boolean> {
    job = {
      ...job,
      dueDate: endOfDay(new Date(job.dueDate)),
    };
    return this.jobService.updateJob(job);
  }

  private insertJobAndUploadFiles(job: Partial<JobBase>): Observable<number> {
    const createFolder = !!this.fileUploadService.filesCount;
    return this.jobService.newJob(job, { createFolder }).pipe(
      tap(jobId => this.fileUploadService.startUpload(jobId)),
    );
  }


}