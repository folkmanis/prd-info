import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { JobFormGroup } from './job-form-group';

export interface DialogData {
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

  openJob(job: Partial<JobBase>): MatDialogRef<ReproJobEditComponent, JobBase> {
    const config: MatDialogConfig = {
      ...CONFIG,
      autoFocus: !job.customer,
      data: {
        job,
      }
    };

    return this.matDialog.open<ReproJobEditComponent, DialogData, JobBase | undefined>(ReproJobEditComponent, config);

  }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.openJob(job).afterClosed()),
      concatMap(data => data ? this.jobService.updateJob(data) : of(false)),
    );
  }


}
