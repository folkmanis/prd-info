import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, concatMap, switchMap, map, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Job } from 'src/app/interfaces';
import { JobDialogComponent } from '../job-edit/job-dialog/job-dialog.component';
import { JobService } from '../services/job.service';
import { JobEditDialogData } from '../job-edit/job-edit-dialog-data';

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

  editJob(jobId: number) {
    this.jobService.getJob(jobId).pipe(
      concatMap(job => this.dialog.open(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          job,
        }
      }).afterClosed()),
      filter(job => !!job),
      map((job: Partial<Job>) => ({ ...job, jobId })),
      switchMap(job => this.jobService.updateJob(job)),
    )
      .subscribe(result => console.log(result));
  }

  newJob(): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobCreateFn: this.jobCreatorFn(),
    };
    return this.dialog.open(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      data
    }).afterClosed().pipe(
      switchMap(job => !job?.jobId ? of(null) : this.jobService.updateJob(job).pipe(
        map(() => job.jobId)
      )),
    );
  }

  private jobCreatorFn(): ((job: Partial<Job>) => Observable<number | null>) {
    return (job) => this.jobService.newJob(job);
  }
}
