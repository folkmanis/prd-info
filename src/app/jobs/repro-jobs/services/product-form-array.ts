import { AbstractControl, AsyncValidatorFn, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductPartial } from 'src/app/interfaces';
import { JobProduct } from '../..';
import { ProductFormGroup } from '../repro-job-edit/repro-products-editor/repro-product/product-form-group';

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
        products: JobProduct[] = [],
    ) {
        const productControls = products
            .map(prod => new FormControl(prod));

        super(productControls);

    }

    addProduct(product?: JobProduct) {
        this.push(new FormControl(product));
        this.markAsDirty();
    }

    removeProduct(idx: number) {
        this.removeAt(idx);
        this.markAsDirty();
    }

}
