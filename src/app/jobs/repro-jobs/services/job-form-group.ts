import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';
import { Job } from '../../interfaces';


export class JobFormGroup extends FormGroup {

    value$: Observable<Job> = this.valueChanges.pipe(
        startWith(this.value),
        shareReplay(1),
    );

    constructor(
        value: Partial<Job> = {},
    ) {
        super(
            {
                jobId: new FormControl(value.jobId),
                customer: new FormControl(value.customer),
                name: new FormControl(
                    value.name,
                    {
                        validators: Validators.required,
                    },

                ),
                receivedDate: new FormControl(
                    new Date(value.receivedDate),
                    Validators.required,
                ),
                dueDate: new FormControl(
                    new Date(value.dueDate),
                    Validators.required,
                ),
                production: new FormGroup({
                    category: new FormControl(
                        value.production?.category,
                        Validators.required,
                    ),
                }),
                comment: new FormControl(value.comment),
                customerJobId: new FormControl(value.customerJobId),
                jobStatus: new FormGroup({
                    generalStatus: new FormControl(value.jobStatus?.generalStatus || 10),
                    timestamp: new FormControl(value.jobStatus?.timestamp || new Date()),
                }),
                products: new FormControl(value.products),
                files: new FormControl(value.files),
            }
        );

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
