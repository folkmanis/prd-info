import { Injectable } from '@angular/core';
import { Observable, EMPTY, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { JobBase } from 'src/app/interfaces';
import { ReproJobService } from './repro-job.service';
import { JobFormService } from './job-form.service';
import { FileUploadService } from './file-upload.service';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { IFormGroup } from '@rxweb/types';

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
    private reproJobService: ReproJobService,
    private formService: JobFormService,
  ) { }

  openJob(job: JobBase): Observable<DialogData | undefined> {
    job = this.setJobDefaults(job);
    const form = this.formService.createJobForm();
    this.formService.initValue(form, job);
    const config = {
      ...CONFIG,
      data: {
        form,
        job,
      }
    };
    return this.matDialog.open<ReproJobEditComponent, DialogData, DialogData>(ReproJobEditComponent, config).afterClosed();

  }

  newJob(job: Partial<JobBase>) {

  }

  private setJobDefaults<T extends JobBase>(job: T): T {
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
