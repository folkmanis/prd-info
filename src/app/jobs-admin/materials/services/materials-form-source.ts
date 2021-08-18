import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { Material, MaterialPrice } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

    updateFn(material: Material): Observable<Material> {
        return this.materialsService.updateMaterial(
            this.cleanValue(material)
        ).pipe(
            switchMap(res => res ? this.materialsService.getMaterial(material._id) : EMPTY)
        );
    }

    insertFn(material: Material): Observable<string> {
        return this.materialsService.insertMaterial(
            this.cleanValue(material)
        );
    }

    initValue(val: Partial<Material>, params?: { emitEvent: boolean; }) {
        this.pricesCtrl.clear({ emitEvent: false });
        for (const price of val.prices || []) {
            this.pricesCtrl.push(
                new MaterialPriceGroup(),
                { emitEvent: false },
            );
        }
        super.initValue(val, params);
    }

    deletePrice(idx: number) {
        this.pricesCtrl.removeAt(idx);
        this.pricesCtrl.markAsDirty();
    }

    private cleanValue(val: Material): Material {
        return {
            ...val,
            name: val.name.trim(),
        };
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
                [Validators.min(0)],
            ),
            price: new FormControl(
                price.price,
                [Validators.required, Validators.min(0)],
            ),
            description: new FormControl(price.description),
        });
    }
}
