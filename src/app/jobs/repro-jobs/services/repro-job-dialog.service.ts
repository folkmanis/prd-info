import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { JobBase } from 'src/app/interfaces';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { JobFormGroup } from './job-form-group';
import { CustomersService, ProductsService } from 'src/app/services';

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
