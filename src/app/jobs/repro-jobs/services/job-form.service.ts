import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isEqual, pickBy } from 'lodash-es';
import { combineLatest, concat, concatMap, debounceTime, distinctUntilChanged, filter, from, map, Observable, of, reduce, shareReplay, switchMap, throttleTime } from 'rxjs';
import { DropFolder, JobProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { Files, Job, JobCategories, JobProduct } from '../../interfaces';
import { ReproJobService } from './repro-job.service';

@Injectable()
export class JobFormService {

  form = this.createForm();

  readonly value$: Observable<Partial<Job>> = this.form.valueChanges.pipe(
    map(() => this.value),
    shareReplay(1),
  );

  readonly update$: Observable<Partial<Job> | undefined> = this.value$.pipe(
    map(job => this.jobDiff(job, this.initialValue)),
    shareReplay(1),
  );

  initialValue: Partial<Job>;

  productionStages$ = this.form.controls.products.valueChanges.pipe(
    debounceTime(300),
    switchMap(products => this.jobService.productionStages(products)),
  );


  get value(): Job {
    return this.form.getRawValue() as Job;
  }

  get update(): Partial<Job> | undefined {
    return this.jobDiff(this.value, this.initialValue);
  }


  constructor(
    private jobService: ReproJobService,
    private stagesService: ProductionStagesService,
  ) { }


  patchValue(value: Partial<Job>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.initialValue = {
      ...this.initialValue,
      ...value,
    };
    this.form.patchValue(value, options);
    this.updateDisabledState(value);
    this.form.markAsPristine();
  };

  setValue(value: Job, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.initialValue = value;
    this.form.reset();
    this.form.patchValue(value, options);
    this.updateDisabledState(value);
  }

  dropFolders$: Observable<DropFolder[]> = combineLatest({
    status: this.form.statusChanges,
    value: concat(
      of(this.form.value),
      this.form.valueChanges,
    )
  }).pipe(
    filter(({ status }) => status === 'VALID'),
    map(({ value }) => value),
    distinctUntilChanged((j1, j2) => j1.customer === j2.customer && isEqual(j1.products, j2.products)),
    throttleTime(200),
    switchMap(job => this.jobService.productionStages(job.products).pipe(
      switchMap(stages => from(stages).pipe(
        concatMap(stage => this.stagesService.getDropFolder(stage.productionStageId, job.customer)),
        reduce((acc, value) => [...acc, ...value], [] as DropFolder[])
      ))
    )),
    map(folders => folders.sort(dropFolderSortFn())),
  );


  private updateDisabledState(value: Partial<Job>) {
    if (value.invoiceId) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
    if (value.jobId !== undefined) {
      this.form.controls.receivedDate.disable({ emitEvent: false });
    }
  }

  private jobDiff(newValue: Partial<Job>, initial: Partial<Job>): Partial<Job> | undefined {
    if (!newValue.jobId) {
      return newValue;
    }
    const diff = pickBy(newValue, (value, key) => key === 'jobId' || !isEqual(value, initial[key]));
    if (Object.keys(diff).length > 1) {
      return diff;
    }
    return undefined;
  }

  private createForm() {
    return new FormGroup({
      jobId: new FormControl<number>(null),
      customer: new FormControl<string>(
        null,
        {
          validators: Validators.required
        }
      ),
      name: new FormControl<string>(
        null,
        {
          validators: Validators.required,
        },
      ),
      receivedDate: new FormControl<Date>(
        new Date(),
        {
          validators: Validators.required,
          nonNullable: true,
        }
      ),
      dueDate: new FormControl<Date>(
        new Date(),
        Validators.required,
      ),
      production: new FormGroup({
        category: new FormControl<JobCategories>(
          null,
          Validators.required,
        ),
      }),
      comment: new FormControl<string>(null),
      customerJobId: new FormControl<string>(null),
      jobStatus: new FormGroup({
        generalStatus: new FormControl<number>(10, { nonNullable: true }),
        timestamp: new FormControl<Date>(new Date(), { nonNullable: true }),
      }),
      products: new FormControl<JobProduct[]>([], { nonNullable: true }),
      files: new FormControl<Files>(null),
      productionStages: new FormControl<JobProductionStage[]>([]),
    }

    );
  }


}


function dropFolderSortFn(): (a: DropFolder, b: DropFolder) => number {
  return function (a, b) {
    if (a.isDefault()) {
      return 1;
    }
    if (b.isDefault()) {
      return -1;
    }
    return 0;
  };
}