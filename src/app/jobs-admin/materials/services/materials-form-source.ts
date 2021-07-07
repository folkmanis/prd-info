import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { Material } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export class MaterialsFormSource extends SimpleFormSource<Material> {

    constructor(
        fb: FormBuilder,
        private materialsService: MaterialsService,
    ) {
        super(fb);
    }

    get isNew(): boolean {
        return !this.form.value._id;
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
