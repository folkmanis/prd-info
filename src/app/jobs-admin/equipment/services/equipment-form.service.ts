import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, FormControl, Validators } from '@angular/forms';
import { tap, map, Observable, of } from 'rxjs';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { AppClassTransformerService } from 'src/app/library';
import { isEqual, pickBy } from 'lodash-es';
import { log } from 'prd-cdk';


@Injectable()
export class EquipmentFormService {

    private initialValue = new Equipment();

    form = new FormGroup({
        _id: new FormControl<string>(null),
        name: new FormControl<string>(
            '',
            [Validators.required],
            [this.nameValidator()]
        ),
        description: new FormControl<string>(null)
    });

    get isNew(): boolean {
        return !this.form.value._id;
    }

    constructor(
        private equipmentService: EquipmentService,
        private transformer: AppClassTransformerService,
    ) { }

    setValue(val: Equipment) {
        if (val._id) {
            this.initialValue = val;
            this.initialValue.name = this.initialValue.name.trim();
        } else {
            this.initialValue = new Equipment();
        }
        this.form.reset(this.initialValue);

    }

    get value(): Equipment {
        return this.transformer.plainToInstance(Equipment, this.form.value);
    }

    get changes(): Partial<Equipment> | undefined {
        if (this.isNew) {
            return pickBy(this.value, value => value !== null);
        } else {
            const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
            return Object.keys(diff).length ? diff : undefined;
        }
    }


    reset() {
        this.form.reset(this.initialValue);
    }

    save(): Observable<Equipment> {

        if (this.isNew) {
            // const equipment = pickBy(this.value, value => value !== null) as Equipment;
            const { _id, ...equipment } = this.value;
            return this.equipmentService.insertOne(equipment).pipe(
                tap(() => this.form.markAsPristine()),
            );
        } else {
            const update = { ...this.changes, _id: this.value._id };
            return this.equipmentService.updateOne(update).pipe(
                tap(value => this.setValue(value)),
            );
        }
    }

    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl<string>) => {
            const name = control.value;
            if (name === this.initialValue.name) {
                return of(null);
            }
            return this.equipmentService.names().pipe(
                map(names => names.includes(name)),
                map(invalid => invalid ? { occupied: name } : null)
            );
        };
    }


}
