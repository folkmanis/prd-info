import { SimpleFormSource } from 'src/app/library/simple-form';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { ProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


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

    insertFn(value: ProductionStage): Observable<string> {
        return this.productionStagesService.insertOne(this.preProcessValue(value));
    }

    updateFn(value: ProductionStage): Observable<ProductionStage> {
        return this.productionStagesService.updateOne(this.preProcessValue(value)).pipe(
            switchMap(_ => this.productionStagesService.getOne(value._id)),
        );
    }

    private preProcessValue(value: ProductionStage): ProductionStage {
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
            return this.productionStagesService.names().pipe(
                map(names => names.some(name => name.toUpperCase() === nameCtrl)),
                map(invalid => invalid ? { occupied: nameCtrl } : null)
            );
        };
    }


}
