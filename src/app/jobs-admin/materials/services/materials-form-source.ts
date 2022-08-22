import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { defaults, isEqual, pickBy } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Material } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { MaterialsService } from './materials.service';

const DEFAULT_MATERIAL: Partial<Material> = {
    inactive: false,
    prices: [],
    fixedPrice: 0,
};

@Injectable()
export class MaterialsFormSource extends SimpleFormSource<Material> {

    get isNew(): boolean {
        return !this.form.value._id;
    }

    constructor(
        fb: UntypedFormBuilder,
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
            prices: [undefined],
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
        return this.materialsService.insertMaterial(this.value).pipe(
            map(mat => mat._id),
        );
    }

    initValue(val: Partial<Material>, params?: { emitEvent: boolean; }) {
        super.initValue(
            defaults(val, DEFAULT_MATERIAL),
            params
        );
    }

    private trimName() {
        this.value.name = this.value.name.trim();
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


}

