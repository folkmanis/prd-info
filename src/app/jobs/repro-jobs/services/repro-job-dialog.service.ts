import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { JobBase } from 'src/app/interfaces';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { JobFormGroup } from './job-form-group';
import { CustomersService, ProductsService } from 'src/app/services';
import { EMPTY, Observable, of } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';
import { endOfDay } from 'date-fns';

export interface DialogData {
  form: JobFormGroup;
  job: Partial<JobBase>;
}

const CONFIG: MatDialogConfig = {
  autoFocus: false,
  maxHeight: '100vh',
  maxWidth: '100vw',
};

@Injectable({
  providedIn: 'root'
})
export class ReproJobDialogService {

  constructor(
    private matDialog: MatDialog,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private jobService: JobService,
  ) { }

  openJob(job: Partial<JobBase>): MatDialogRef<ReproJobEditComponent, DialogData> {
    job = this.setJobDefaults(job);
    const form = new JobFormGroup(this.customersService, this.productsService, job);
    const config: MatDialogConfig = {
      ...CONFIG,
      autoFocus: !job.customer,
      data: {
        form,
        job,
      }
    };

    return this.matDialog.open<ReproJobEditComponent, DialogData, DialogData>(ReproJobEditComponent, config);

  }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.openJob(job).afterClosed()),
      concatMap(data => data ? this.jobService.updateJob(data.job) : of(false)),
    );
  }

  private setJobDefaults<T extends Partial<JobBase>>(job: T): T {
    return {
      ...job,
      receivedDate: job.receivedDate || new Date(),
      dueDate: job.dueDate || new Date(),
      jobStatus: {
        generalStatus: job.jobStatus?.generalStatus || 10
      }
    };
  }


}
