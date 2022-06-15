import { UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { JobProduct } from 'src/app/jobs/interfaces';



export class ProductFormGroup extends UntypedFormGroup {

    constructor(
        product: Partial<JobProduct> = {},
    ) {
        super({
            name: new UntypedFormControl(product.name),
            price: new UntypedFormControl(
                product.price,
                {
                    validators: [Validators.required, Validators.min(0)],
                },
            ),
            count: new UntypedFormControl(
                product.count,
                {
                    validators: [Validators.required, Validators.min(0)],
                },
            ),
            units: new UntypedFormControl(
                product.units,
                Validators.required,
            ),
            comment: new UntypedFormControl(product.comment),
        });
    }

}
