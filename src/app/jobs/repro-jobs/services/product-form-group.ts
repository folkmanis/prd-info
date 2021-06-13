import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';



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
                Validators.min(0),
            ),
            count: new FormControl(
                product.count || 0,
                Validators.min(0),
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
