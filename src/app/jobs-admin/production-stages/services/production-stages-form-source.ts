import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, UntypedFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { pickBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductionStage, DropFolder } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { ClassTransformer } from 'class-transformer';


@Injectable({
    providedIn: 'root'
})
export class ProductionStagesFormSource extends SimpleFormSource<ProductionStage> {

    get isNew(): boolean {
        return !this.form.value._id;
    }

    constructor(
        fb: UntypedFormBuilder,
        private productionStagesService: ProductionStagesService,
        private transformer: ClassTransformer,
    ) {
        super(fb);
    }

    createForm() {
        return new FormGroup({
            _id: new FormControl<string>(undefined),
            name: new FormControl<string>(
                '',
                {
                    validators: [Validators.required],
                    asyncValidators: [this.nameValidator()],
                }
            ),
            description: new FormControl<string>(null),
            equipmentIds: new FormControl<string[]>([]),
            dropFolders: new FormControl<DropFolder[]>(null),
        }) as IFormGroup<ProductionStage>;
    }

    createEntity(): Observable<string> {
        const { _id, ...values } = this.transformer.plainToInstance(ProductionStage, this.value);
        return this.productionStagesService.insertOne(values).pipe(
            map(value => value._id),
        );
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
