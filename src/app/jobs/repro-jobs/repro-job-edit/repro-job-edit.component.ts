import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDays, subDays } from 'date-fns';
import { isEqual, pickBy } from 'lodash';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { CustomerPartial, SystemPreferences } from 'src/app/interfaces';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, LayoutService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { JobFormGroup } from '../services/job-form-group';
import { DialogData } from '../services/repro-job-dialog.service';

const LARGE_SCREEN_SIZE = {
  height: '90%',
  width: '90%',
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

  form = new JobFormGroup(this.data.job);

  isLarge$: Observable<boolean> = this.layoutService.isLarge$;
  isSmall$ = this.layoutService.isSmall$;

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );

  jobIdAndName$ = this.form.value$.pipe(
    map(job => this.jobIdAndName(job)),
  );

  customerProducts$ = this.form.value$.pipe(
    pluck('customer'),
    filter(customer => !!customer),
    distinctUntilChanged(),
    switchMap(customer => this.productsService.productsCustomer(customer)),
  );

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  folderPath$ = this.form.value$.pipe(
    pluck('files'),
    map(files => files?.path?.join('/'))
  );

  fileUploadProgress$ = this.data.fileUploadProgress;

  get nameControl() {
    return this.form.get('name') as FormControl;
  }


  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<ReproJobEditComponent, DialogData>,
    private layoutService: LayoutService,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private sanitize: SanitizeService,
    private loginService: LoginService,
    private jobsService: JobService,
  ) { }

  ngOnInit(): void {

    this.layoutService.isLarge$.pipe(
      takeUntil(this.dialogRef.beforeClosed()),
    ).subscribe(isLarge => this.setScreenConfig(isLarge));

  }

  isFormValid() {
    return !this.form.pristine && this.form.valid;
  }

  onUpdate() {
    const job = this.jobDiff();
    this.dialogRef.close({ job });
  }

  onCreateFolder() {
    const jobId = this.form.value.jobId as number;
    this.jobsService.createFolder(jobId).pipe(
      pluck('files'),
    )
      .subscribe(files => this.form.controls.files.setValue(files));
  }

  private setScreenConfig(isLarge: boolean): void {
    this.dialogRef.updateSize(
      isLarge ? LARGE_SCREEN_SIZE.width : SMALL_SCREEN_SIZE.width,
      isLarge ? LARGE_SCREEN_SIZE.height : SMALL_SCREEN_SIZE.height,
    );
  }

  private jobDiff(): Partial<Job> | undefined {
    if (this.isNew) {
      return this.form.value;
    }
    const newJob = this.form.value;
    const oldJob = this.data.job;
    const diff = pickBy(newJob, (value, key) => key === 'jobId' || !isEqual(value, oldJob[key]));
    if (Object.keys(diff).length > 1) {
      return diff;
    }
    return undefined;
  }

  private jobIdAndName(job: Job) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }


}


