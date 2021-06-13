import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormGroup } from '@rxweb/types';
import { log } from 'prd-cdk';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { DialogData } from '../services/repro-job-dialog.service';
import { JobFormGroup } from '../services/job-form-group';

const LARGE_SCREEN_SIZE = {
  height: '90%',
  width: '80%',
};
const SMALL_SCREEN_SIZE = {
  height: '100%',
  width: '100%',
};


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobEditComponent implements OnInit {

  form: JobFormGroup;

  isLarge$: Observable<boolean> = this.layoutService.isLarge$;

  get isNew(): boolean {
    return !this.form.jobValue.jobId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<ReproJobEditComponent, DialogData>,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.form = this.data.form;

    this.layoutService.isLarge$.pipe(
      takeUntil(this.dialogRef.beforeClosed()),
    ).subscribe(isLarge => this.setScreenConfig(isLarge));
  }

  private setScreenConfig(isLarge: boolean): void {
    this.dialogRef.updateSize(
      isLarge ? LARGE_SCREEN_SIZE.width : SMALL_SCREEN_SIZE.width,
      isLarge ? LARGE_SCREEN_SIZE.height : SMALL_SCREEN_SIZE.height,
    );
  }


}
