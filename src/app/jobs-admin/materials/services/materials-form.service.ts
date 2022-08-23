import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defaults, isEqual, pickBy } from 'lodash-es';
import { Observable, of, tap, map } from 'rxjs';
import { Material, MaterialPrice } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';
import { ClassTransformer } from 'class-transformer';


type MaterialForm = {
    [k in keyof Material]-?: FormControl<Material[k]>
};


@Injectable()
export class MaterialsFormService {

    initialValue: Material = new Material();

    form = new FormGroup<MaterialForm>({
        _id: new FormControl(''),
        name: new FormControl(
            '',
            [Validators.required],
            [this.nameValidator()]
        ),
        description: new FormControl(''),
        units: new FormControl(
            '',
            [Validators.required],
        ),
        category: new FormControl(
            '',
            [Validators.required],
        ),
        inactive: new FormControl(false),
        prices: new FormControl([]),
        fixedPrice: new FormControl(0),
    });

    get isNew(): boolean {
        return !this.initialValue?._id;
    }

    get value() {
        return this.transformer.plainToInstance(Material, this.form.value, { exposeDefaultValues: true });
    }

    get changes(): Partial<Material> | undefined {
        if (this.isNew) {
            return pickBy(this.value, value => value !== null);
        } else {
            const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
            return Object.keys(diff).length ? diff : undefined;
        }
    }



    constructor(
        private materialsService: MaterialsService,
        private transformer: ClassTransformer,
    ) { }

    save(): Observable<Material> {
        if (this.isNew) {
            const material = pickBy(this.value, value => value !== null);
            return this.materialsService.insertMaterial(material).pipe(
                tap(() => this.form.markAsPristine()),
            );
        } else {
            const update = { ...this.changes, _id: this.value._id };
            return this.materialsService.updateMaterial(update).pipe(
                tap(value => this.setInitial(value)),
            );
        }
    }

    reset() {
        this.form.reset(this.initialValue);
    }


    setInitial(val: Material) {
        if (val._id) {
            this.initialValue = val;
        } else {
            this.initialValue = new Material();
        }
        this.form.reset(this.initialValue);
    }


    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl<string>) => {
            const nameCtrl = control.value.trim().toUpperCase();
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

