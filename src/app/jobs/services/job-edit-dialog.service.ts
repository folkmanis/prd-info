import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';
import { JobDialogComponent } from '../job-edit/job-dialog.component';
import { JobEditDialogData } from '../job-edit/job-edit-dialog-data';
import { JobEditFormService } from './job-edit-form.service';

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
    private productsService: ProductsService,
    private jobEditForm: JobEditFormService,
  ) { }

  products$ = this.productsService.activeProducts$;

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.dialog.open(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          jobForm: this.jobEditForm.jobFormBuilder(job),
        }
      }).afterClosed()),
      concatMap(job => job ? this.jobService.updateJob(this.afterJobEdit({ ...job, jobId })) : of(false)),
    );
  }

  newJob(jobInit?: Partial<JobBase>): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobForm: this.jobEditForm.jobFormBuilder(jobInit),
      jobCreateFn: this.jobCreatorFn(),
    };
    return this.dialog.open(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      autoFocus: true,
      data
    }).afterClosed().pipe(
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
