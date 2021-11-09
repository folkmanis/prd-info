import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';


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

    createEntity(): Observable<string> {
        this.trimValue();
        return this.equipmentService.insertOne(this.value).pipe(
            pluck('_id'),
        );
    }

    updateEntity(): Observable<Equipment> {
        this.trimValue();
        return this.equipmentService.updateOne(this.value);
    }

    private trimValue() {
        this.value.name = this.value.name.trim();
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
