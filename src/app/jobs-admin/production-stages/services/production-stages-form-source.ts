import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { pickBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductionStage } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';


@Injectable({
    providedIn: 'root'
})
export class ProductionStagesFormSource extends SimpleFormSource<ProductionStage> {

    get isNew(): boolean {
        return !this.form.value._id;
    }

    constructor(
        fb: FormBuilder,
        private productionStagesService: ProductionStagesService,
    ) {
        super(fb);
    }

    createForm(): IFormGroup<ProductionStage> {
        return this.fb.group<ProductionStage>({
            _id: [undefined],
            name: [
                '',
                [Validators.required],
                [this.nameValidator()]
            ],
            description: [undefined],
            equipmentIds: [
                []
            ]
        });
    }

    createEntity(): Observable<string> {
        const { _id, ...values } = pickBy<ProductionStage>(this.value, val => val !== null);
        return this.productionStagesService.insertOne(values);
    }

    updateEntity(): Observable<ProductionStage> {
        if (this.changes) {
            return this.productionStagesService.updateOne({ _id: this.value._id, ...this.changes });
        } else {
            return of(this.value);
        }
    }

    private nameValidator(): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const nameCtrl: string = (control.value as string).trim().toUpperCase();
            if (nameCtrl === this.initialValue.name?.toUpperCase()) {
                return of(null);
            }
            return this.productionStagesService.names().pipe(
                map(names => names.some(name => name.toUpperCase() === nameCtrl)),
                map(invalid => invalid ? { occupied: nameCtrl } : null)
            );
        };
    }


}
