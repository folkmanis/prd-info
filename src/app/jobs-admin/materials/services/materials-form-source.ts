import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { defaults, isEqual, pickBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Material, MaterialPrice } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { MaterialsService } from './materials.service';

const DEFAULT_MATERIAL: Partial<Material> = {
    inactive: false,
    prices: [],
    fixedPrice: 0,
};

@Injectable({
    providedIn: 'root'
})
export class MaterialsFormSource extends SimpleFormSource<Material> {

    get isNew(): boolean {
        return !this.form.value._id;
    }

    get pricesCtrl(): FormArray {
        return this.form.get('prices') as unknown as FormArray;
    }


    constructor(
        fb: FormBuilder,
        private materialsService: MaterialsService,
    ) {
        super(fb);
    }

    protected createForm(): IFormGroup<Material> {
        return this.fb.group<Material>({
            _id: [undefined],
            name: [
                undefined,
                [Validators.required],
                [this.nameValidator()]
            ],
            description: [undefined],
            units: [
                undefined,
                [Validators.required],
            ],
            category: [
                undefined,
                [Validators.required],
            ],
            inactive: [false],
            prices: this.fb.array<MaterialPrice>(
                [],
                [this.duplicatePriceValidator()],
            ),
            fixedPrice: [undefined],
        });
    }

    updateEntity(): Observable<Material> {
        this.trimName();
        const diff = pickBy(this.value, (value, key) => key === '_id' || !isEqual(value, this.initialValue[key]));
        return this.materialsService.updateMaterial(diff);
    }

    createEntity(): Observable<string> {
        this.trimName();
        return this.materialsService.insertMaterial(this.value);
    }

    initValue(val: Partial<Material>, params?: { emitEvent: boolean; }) {
        this.pricesCtrl.clear({ emitEvent: false });
        for (const price of val.prices || []) {
            this.pricesCtrl.push(
                new MaterialPriceGroup(),
                { emitEvent: false },
            );
        }
        super.initValue(
            defaults(val, DEFAULT_MATERIAL),
            params
        );
    }

    deletePrice(idx: number) {
        this.pricesCtrl.removeAt(idx);
        this.pricesCtrl.markAsDirty();
    }

    private trimName() {
        this.value.name = this.value.name.trim();
    }

    updatePriceControl(control: MaterialPriceGroup, idx?: number) {

        if (idx !== undefined) {
            this.pricesCtrl.removeAt(idx, { emitEvent: false });
        }

        const controls = this.pricesCtrl.controls as MaterialPriceGroup[];
        const newMin = control.priceValue.min;
        let newPos = 0;
        while (newPos < this.pricesCtrl.length && newMin > controls[newPos].priceValue.min) {
            newPos++;
        }

        this.pricesCtrl.insert(newPos, control);
        this.pricesCtrl.updateValueAndValidity();
        this.pricesCtrl.markAsDirty();
    }

    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const nameCtrl: string = (control.value as string).trim().toUpperCase();
            if (nameCtrl === this.initialValue.name?.toUpperCase()) {
                return of(null);
            }
            return this.materialsService.getNamesForValidation().pipe(
                map(names => names.some(name => name.toUpperCase() === nameCtrl)),
                map(invalid => invalid ? { occupied: nameCtrl } : null)
            );
        };
    }

    private duplicatePriceValidator(): ValidatorFn {
        return (control: FormArray) => {
            const ctrls = control.controls as MaterialPriceGroup[];
            const duplicates = ctrls
                .filter((el, idx, a) => a.findIndex(m => m.priceValue.min === el.priceValue.min) !== idx)
                .map(ctrl => ctrl.priceValue.min);
            if (duplicates.length === 0) {
                return null;
            }
            return { duplicates: ctrls.filter(ctrl => duplicates.includes(ctrl.priceValue.min)) };
        };
    }

}

export class MaterialPriceGroup extends FormGroup {

    get priceValue(): MaterialPrice {
        return this.value;
    }

    constructor(price: Partial<MaterialPrice> = {}) {
        super({
            min: new FormControl(
                price.min,
                [Validators.required, Validators.min(0)],
            ),
            price: new FormControl(
                price.price,
                [Validators.required, Validators.min(0)],
            ),
            description: new FormControl(price.description),
        });
    }
}
