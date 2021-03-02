import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { EMPTY, Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { JobDialogComponent } from '../job-dialog.component';
import { JobEditDialogData } from '../job-edit-dialog-data';
import { JobEditDialogResult } from '../job-edit-dialog-result';
import { FileUploadService } from '../../services/file-upload.service';

const JOB_DIALOG_CONFIG: MatDialogConfig = {
  height: '90%',
  width: '90%',
  autoFocus: false,
  data: {},
};

@Injectable()
export class JobEditDialogService {

  constructor(
    private dialog: MatDialog,
    private jobService: JobService,
    private fileUploadService: FileUploadService,
  ) { }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.dialog.open<JobDialogComponent, JobEditDialogData, JobEditDialogResult>(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          job,
        }
      }).afterClosed()),
      concatMap(resp => !resp ? of(false) : this.jobService.updateJob(resp.job)),
    );
  }

  newJob(jobInit?: Partial<JobBase>, files?: File[]): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobCreateFn: this.jobCreatorFn(),
      job: jobInit,
      files,
    };
    const dialogRef = this.dialog.open<JobDialogComponent, JobEditDialogData, JobEditDialogResult>(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      autoFocus: true,
      data
    });

    return dialogRef.afterClosed().pipe(
      concatMap(resp => !resp ? of(undefined) : this.jobService.updateJob(resp.job).pipe(
        concatMap(_ => this.fileUploadService.uploadFiles(resp.job.jobId, resp.files)),
        map(_ => resp.job.jobId)
      )),
    );

  }

  private jobCreatorFn(): ((job: Partial<JobBase>) => Observable<number | null>) {
    return (job) => this.jobService.newJob(job);
  }

}
