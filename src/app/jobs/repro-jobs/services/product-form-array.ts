import { AbstractControl, AsyncValidatorFn, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductPartial } from 'src/app/interfaces';
import { JobProduct } from '../..';
import { ProductFormGroup } from './product-form-group';

const productNameValidatorFn = (products$: Observable<ProductPartial[]>): AsyncValidatorFn => {
    return (control: AbstractControl) => {
        const val: string = control.value;
        return products$.pipe(
            map(products => products.some(prod => prod.name === val)),
            map(is => is ? null : { invalidProduct: 'Prece nav atrasta katalogā' }),
            take(1),
        );
    };
};

export class ProductFormArray extends FormArray {

    private validatorFn: AsyncValidatorFn;

    constructor(
        products$: Observable<ProductPartial[]>,
        products: JobProduct[] = [],
    ) {
        const validatorFn = productNameValidatorFn(products$);
        const productControls = products
            .map(prod => new ProductFormGroup(validatorFn, prod));

        super(productControls);

        this.validatorFn = validatorFn;
    }

    addProduct(product?: JobProduct) {
        this.push(new ProductFormGroup(this.validatorFn, product));
        this.markAsDirty();
    }

    removeProduct(idx: number) {
        this.removeAt(idx);
        this.markAsDirty();
    }

}
