import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';
import { ProductFormGroup } from './product-form-group';

const productNameValidatorFn = (productsService: ProductsService): AsyncValidatorFn => {
    return (control: AbstractControl) => {
        const val: string = control.value;
        return productsService.products$.pipe(
            map(products => products.some(prod => prod.name === val)),
            map(is => is ? null : { invalidProduct: 'Prece nav atrasta katalogā' }),
            take(1),
        );
    };
};

export class ProductFormArray extends FormArray {

    constructor(
        private productsService: ProductsService,
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
                productNameValidatorFn(this.productsService),
            )
        );
        this.markAsDirty();
    }

    removeProduct(idx: number) {
        this.removeAt(idx);
        this.markAsDirty();
    }

}
