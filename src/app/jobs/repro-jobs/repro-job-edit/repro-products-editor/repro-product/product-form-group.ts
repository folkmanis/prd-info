import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { JobProduct } from 'src/app/jobs/interfaces';



export class ProductFormGroup extends FormGroup {

    constructor(
        product: Partial<JobProduct> = {},
    ) {
        super({
            name: new FormControl(product.name),
            price: new FormControl(
                product.price,
                {
                    validators: [Validators.required, Validators.min(0)],
                },
            ),
            count: new FormControl(
                product.count,
                {
                    validators: [Validators.required, Validators.min(0)],
                },
            ),
            units: new FormControl(
                product.units,
                Validators.required,
            ),
            comment: new FormControl(product.comment),
        });
    }

}
