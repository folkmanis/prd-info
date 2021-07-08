import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
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
            prices: this.fb.array<MaterialPrice>([]),
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
                this.newMaterialPriceGroup(),
                { emitEvent: false },
            );
        }
        super.initValue(val, params);
    }

    deletePrice(idx: number) {
        this.pricesCtrl.removeAt(idx);
        this.pricesCtrl.markAsDirty();
    }

    newMaterialPriceGroup(price: Partial<MaterialPrice> = {}): IFormGroup<MaterialPrice> {
        return this.fb.group<MaterialPrice>({
            min: [
                price.min,
                [Validators.min(0)],
            ],
            max: [
                price.max,
                [Validators.min(0)],
            ],
            price: [
                price.price,
                [Validators.required, Validators.min(0)],
            ],
            description: [price.description],
        });
    }

    private cleanValue(val: Material): Material {
        return {
            ...val,
            name: val.name.trim(),
        };
    }

    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const nameCtrl: string = (control.value as string).trim().toUpperCase();
            if (!this.initialValue || nameCtrl === this.initialValue.name.toUpperCase()) {
                return of(null);
            }
            return this.materialsService.getNamesForValidation().pipe(
                map(names => names.some(name => name.toUpperCase() === nameCtrl)),
                map(invalid => invalid ? { occupied: nameCtrl } : null)
            );
        };
    }

}
