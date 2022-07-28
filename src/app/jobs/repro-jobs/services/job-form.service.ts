import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobProductionStage } from 'src/app/interfaces';
import { JobProduct, Files } from '../../interfaces';
import { Job, JobStatus, JobCategories } from '../../interfaces';
import { Observable, shareReplay, map } from 'rxjs';
import { isEqual, pickBy } from 'lodash';

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


  get value(): Job {
    return this.form.getRawValue() as Job;
  }

  get update(): Partial<Job> | undefined {
    return this.jobDiff(this.value, this.initialValue);
  }


  constructor() { }


  patchValue(value: Partial<Job>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.initialValue = {
      ...this.initialValue,
      ...value,
    };
    this.form.patchValue(value, options);
    this.updateDisabledState(value);
    this.form.markAsPristine();
  }

  setValue(value: Job, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    this.initialValue = value;
    this.form.reset();
    this.form.patchValue(value, options);
    this.updateDisabledState(value);
  }

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
