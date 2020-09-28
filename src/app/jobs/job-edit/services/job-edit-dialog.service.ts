import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { JobDialogComponent } from '../job-dialog.component';
import { JobEditDialogData } from '../job-edit-dialog-data';

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
  ) { }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.dialog.open(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          job,
        }
      }).afterClosed()),
      concatMap(job => job ? this.jobService.updateJob(this.afterJobEdit({ ...job, jobId })) : of(false)),
    );
  }

  newJob(jobInit?: Partial<JobBase>): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobCreateFn: this.jobCreatorFn(),
      job: jobInit,
    };
    const dialogRef = this.dialog.open(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      autoFocus: true,
      data
    });
    return dialogRef.afterClosed().pipe(
      concatMap(job => !job?.jobId ? of(null) : this.jobService.updateJob(this.afterJobEdit(job)).pipe(
        map(() => job.jobId)
      )),
    );

  }

  private jobCreatorFn(): ((job: Partial<JobBase>) => Observable<number | null>) {
    return (job) => this.jobService.newJob(job);
  }

  private afterJobEdit(job: Partial<JobBase>): Partial<JobBase> {
    return {
      ...job,
      dueDate: moment(job.dueDate).endOf('day').toDate(),
    };
  }

}
