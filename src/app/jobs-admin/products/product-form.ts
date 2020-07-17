import { FormGroup, FormControl, FormArray, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Product, ProductPrice } from 'src/app/interfaces';
import { filter, share } from 'rxjs/operators';
import { Observable } from 'rxjs';

type Controls = {
    [P in keyof Product]: AbstractControl;
};

export enum StatusText {
    PRISTINE = '',
    PROCESSING = 'Saglabā',
    SAVED = 'Viss saglabāts',
    INVALID = 'Nepilnīgi vai kļūdaini dati',
}

const CONTROLS: Controls = {
    _id: new FormControl(),
    inactive: new FormControl(false),
    name: new FormControl(),
    category: new FormControl(),
    description: new FormControl(),
    prices: new FormArray([]),
};

export class ProductFormGroup extends FormGroup {

    constructor(
        private _priceAddFn: (price?: ProductPrice) => FormGroup,
    ) {
        super(CONTROLS);
    }

    get(ctrl: keyof Product): FormControl | FormArray {
        return super.get(ctrl) as FormControl | FormArray;
    }

    reset(prod: Partial<Product>, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
        const ctrlVal = { ...prod };
        delete ctrlVal.prices;
        super.reset(ctrlVal, options);
        if (prod.prices) {
            this.setControl(
                'prices',
                new FormArray(
                    prod.prices.map(price => this._priceAddFn(price)),
                    [duplicateCustomersValidator()],
                )
            );
        }
    }

    get statusText(): { status: string, color?: string; } {
        if (this.touched && this.pristine) {
            return { status: StatusText.SAVED, color: 'green' };
        }
        if (this.touched && this.invalid) {
            return { status: StatusText.INVALID, color: 'red' };
        }
        if (!this.pristine && this.valid) {
            return { status: StatusText.PROCESSING, color: 'orange' };
        }
        return { status: StatusText.PRISTINE };
    }

}

function duplicateCustomersValidator(): ValidatorFn {
    return (ctrl: FormArray): ValidationErrors | null => {
        const customers: string[] = (ctrl.value as ProductPrice[]).map(pr => pr.customerName);
        // const counts: { [key: string]: number; } = customers.reduce((acc, val) => ({ ...acc, [val]: (acc[val] || 0) + 1 }), {});
        const duplicates: string[] = customers.filter((val, idx, self) => self.indexOf(val) !== idx);
        return duplicates.length === 0 ? null : { duplicates: duplicates.join() };
    };
}
