import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


export class EquipmentFormSource extends SimpleFormSource<Equipment> {

    get isNew(): boolean {
        return !this.form.value._id;
    }

    constructor(
        fb: FormBuilder,
        private equipmentService: EquipmentService,
    ) {
        super(fb);
    }

    protected createForm(): IFormGroup<Equipment> {
        return this.fb.group<Equipment>({
            _id: [undefined],
            name: [
                '',
                [Validators.required],
                [this.nameValidator()]
            ],
            description: [undefined],
        });
    }

    insertFn(value: Equipment): Observable<string> {
        return this.equipmentService.insertOne(this.preProcessValue(value));
    }

    updateFn(value: Equipment): Observable<Equipment> {
        return this.equipmentService.updateOne(this.preProcessValue(value)).pipe(
            switchMap(resp => resp ? this.equipmentService.getOne(value._id) : EMPTY)
        );
    }

    private preProcessValue(value: Equipment): Equipment {
        return {
            ...value,
            name: value.name.trim(),
        };
    }

    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const nameCtrl: string = (control.value as string).trim().toUpperCase();
            if (nameCtrl === this.initialValue.name?.toUpperCase()) {
                return of(null);
            }
            return this.equipmentService.names().pipe(
                map(names => names.some(name => name.toUpperCase() === nameCtrl)),
                map(invalid => invalid ? { occupied: nameCtrl } : null)
            );
        };
    }


}
