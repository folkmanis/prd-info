import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEqual, pickBy } from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job } from 'src/app/interfaces';
import { CustomersService, LayoutService, ProductsService } from 'src/app/services';
import { JobFormGroup } from '../services/job-form-group';
import { DialogData } from '../services/repro-job-dialog.service';

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
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { }

  ngOnInit(): void {

    this.form = new JobFormGroup(
      this.customersService.customers$,
      this.productsService.products$,
      this.data.job,
    );

    this.layoutService.isLarge$.pipe(
      takeUntil(this.dialogRef.beforeClosed()),
    ).subscribe(isLarge => this.setScreenConfig(isLarge));

  }

  isFormValid() {
    return !this.form.pristine && this.form.valid;
  }

  jobUpdate(): Partial<Job> | undefined {
    if (this.isNew) {
      return this.form.value;
    }
    return this.isFormValid() && jobDiff(this.form.value, this.data.job);
  }

  private setScreenConfig(isLarge: boolean): void {
    this.dialogRef.updateSize(
      isLarge ? LARGE_SCREEN_SIZE.width : SMALL_SCREEN_SIZE.width,
      isLarge ? LARGE_SCREEN_SIZE.height : SMALL_SCREEN_SIZE.height,
    );
  }

}

function jobDiff(newJob: Job, oldJob: Partial<Job>): Partial<Job> | undefined {
  const diff = pickBy(newJob, (value, key) => key === 'jobId' || !isEqual(value, oldJob[key]));
  if (Object.keys(diff).length > 1) {
    return diff;
  }
  return undefined;
}

