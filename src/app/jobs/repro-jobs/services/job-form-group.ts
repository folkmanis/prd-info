import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { isEqual, pickBy } from 'lodash';
import { Observable } from 'rxjs';
import { shareReplay, startWith, map } from 'rxjs/operators';
import { Job } from '../../interfaces';


@Injectable()
export class JobFormGroup extends UntypedFormGroup {

    readonly value$: Observable<Job> = this.valueChanges.pipe(
        // startWith(this.value),
        shareReplay(1),
    );

    readonly update$: Observable<Partial<Job> | undefined> = this.value$.pipe(
        map(job => jobDiff(job, this.initialValue)),
    );

    initialValue: Partial<Job>;

    get update(): Partial<Job> {
        return jobDiff(this.value, this.initialValue);
    }

    constructor(
    ) {
        const value: Partial<Job> = {};
        super(
            {
                jobId: new UntypedFormControl(undefined),
                customer: new UntypedFormControl(undefined),
                name: new UntypedFormControl(
                    undefined,
                    {
                        validators: Validators.required,
                    },

                ),
                receivedDate: new UntypedFormControl(
                    new Date(),
                    Validators.required,
                ),
                dueDate: new UntypedFormControl(
                    new Date(),
                    Validators.required,
                ),
                production: new UntypedFormGroup({
                    category: new UntypedFormControl(
                        undefined,
                        Validators.required,
                    ),
                }),
                comment: new UntypedFormControl(null),
                customerJobId: new UntypedFormControl(null),
                jobStatus: new UntypedFormGroup({
                    generalStatus: new UntypedFormControl(10),
                    timestamp: new UntypedFormControl(new Date()),
                }),
                products: new UntypedFormControl(undefined),
                files: new UntypedFormControl(undefined),
            }
        );

    }

    patchValue(value: Partial<Job>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
        this.initialValue = {
            ...this.initialValue,
            ...value,
        };
        super.patchValue(value, options);
        this.updateDisabledState(value);
        this.markAsPristine();
    }

    setValue(value: Job, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
        this.initialValue = value;
        super.setValue(value, options);
        this.updateDisabledState(value);
        this.markAsPristine();
    }

    private updateDisabledState(value: Partial<Job>) {
        if (value.invoiceId) {
            this.disable({ emitEvent: false });
        } else {
            this.enable({ emitEvent: false });
        }
        if (value.jobId !== undefined) {
            this.get('receivedDate').disable({ emitEvent: false });
        }
    }


}

function jobDiff(newValue: Partial<Job>, initial: Partial<Job>): Partial<Job> | undefined {
    if (!newValue.jobId) {
        return newValue;
    }
    const diff = pickBy(newValue, (value, key) => key === 'jobId' || !isEqual(value, initial[key]));
    if (Object.keys(diff).length > 1) {
        return diff;
    }
    return undefined;
}
