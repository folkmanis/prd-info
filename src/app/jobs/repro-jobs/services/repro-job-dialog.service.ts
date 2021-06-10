import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { IFormGroup } from '@rxweb/types';
import { JobBase } from 'src/app/interfaces';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { JobFormService } from './job-form.service';

export interface DialogData {
  form: IFormGroup<JobBase>;
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
    private formService: JobFormService,
  ) { }

  openJob(job: Partial<JobBase>): MatDialogRef<ReproJobEditComponent, DialogData> {
    job = this.setJobDefaults(job);
    const form = this.formService.createJobForm();
    this.formService.initValue(form, job);
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
