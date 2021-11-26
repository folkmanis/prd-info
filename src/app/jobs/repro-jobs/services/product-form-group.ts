import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { JobProduct } from 'src/app/interfaces';



export class ProductFormGroup extends FormGroup {

    constructor(
        nameValidator: AsyncValidatorFn,
        product: Partial<JobProduct> = {},
    ) {
        super({
            name: new FormControl(
                product.name,
                {
                    validators: [Validators.required],
                    asyncValidators: [nameValidator],
                },
            ),
            price: new FormControl(
                product.price,
                {
                    validators: [Validators.required, Validators.min(0)],
                }                ,
            ),
            count: new FormControl(
                product.count || 0,
                {
                    validators: [Validators.required, Validators.min(0)],
                },
            ),
            units: new FormControl(
                product.units,
                Validators.required,
            ),
            comment: new FormControl(
                product.comment,
            ),
        });
    }

}
