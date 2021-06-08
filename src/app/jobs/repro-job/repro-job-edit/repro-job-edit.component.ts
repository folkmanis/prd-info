import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup } from '@rxweb/types';
import { JobBase } from 'src/app/interfaces';
import { DialogData } from '../services/repro-job-dialog.service';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobEditComponent implements OnInit {

  form: IFormGroup<JobBase>;

  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<ReproJobEditComponent, DialogData>,
  ) { }

  ngOnInit(): void {
    this.form = this.data.form;
  }

  onSave() {
    if (!this.form.valid || this.form.pristine) {
      return;
    }
    this.dialogRef.close({ form: this.form, job: this.form.value });
  }


}
