import { AbstractControl, AsyncValidatorFn, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductPartial } from 'src/app/interfaces';
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

    constructor(
        private products$: Observable<ProductPartial[]>,
    ) {
        super([]);
    }

    setProductControls(count: number) {
        if (this.length) { this.clear(); }
        for (let i = 0; i < count; i++) {
            this.addProduct();
        }
    }

    addProduct() {
        this.push(
            new ProductFormGroup(
                productNameValidatorFn(this.products$),
            )
        );
        this.markAsDirty();
    }

    removeProduct(idx: number) {
        this.removeAt(idx);
        this.markAsDirty();
    }

}
