import { Component, OnInit, Inject } from '@angular/core';
import { tap, map, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PlateJobEditorComponent } from '../../plate-job/plate-job-editor/plate-job-editor.component';
import { Job } from 'src/app/interfaces';
import { JobEditDialogData } from '../job-edit-dialog-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css']
})
export class JobDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: JobEditDialogData,
    private dialogRef: MatDialogRef<JobDialogComponent>,
    private snack: MatSnackBar,
  ) { }

  newJob: Partial<Job> | undefined = { ...this.data.job };

  newJobId$: Observable<number> | undefined;

  ngOnInit(): void {
  }

  onJobUpdate(newJob: Partial<Job>) {
    if (!this.data.job && this.data.jobCreateFn && !this.newJobId$ && newJob?.customer) {
      this.newJobId$ = this.data.jobCreateFn({ customer: newJob.customer, name: 'Bez nosaukuma' }).pipe(
        tap(newJobId => {
          if (!newJobId) { this.dialogRef.close(null); }
        }),
        filter(newJobId => !!newJobId)
      );
      this.newJobId$.subscribe(newJobId => this.newJob.jobId = newJobId);
    }
    this.newJob = { ...this.newJob, ...newJob };
    console.log(this.newJob);
    // this.dialogRef.close({ job });
  }

  onCopy(value: string) {
    this.snack.open(`${value} izkopēts!`, 'OK', { duration: 2000 });
  }

}
