import { AsyncValidatorFn, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product, ProductPrice, JobProductionStage, ProductionStage, JobProductionStageMaterial } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductsFormSource extends SimpleFormSource<Product> {

    constructor(
        fb: UntypedFormBuilder,
        private productService: ProductsService,
    ) {
        super(fb);
    }

    get productionStages() {
        return this.form.get('productionStages') as unknown as UntypedFormArray;
    }

    get isNew(): boolean {
        return !this.startValue?.name;
    }

    private startValue: Partial<Product> | undefined;

    protected createForm(): IFormGroup<Product> {
        const productForm: IFormGroup<Product> = this.fb.group<Product>({
            inactive: [false],
            category: [
                undefined,
                [Validators.required]
            ],
            name: [
                undefined,
                {
                    validators: Validators.required,
                }
            ],
            description: [undefined],
            units: [
                undefined,
                {
                    validators: Validators.required,
                }
            ],
            prices: new FormControl<ProductPrice[]>([]),
            paytraqId: [undefined],
            productionStages: new UntypedFormArray([]),
        });

        return productForm;
    }

    initValue(product: Partial<Product>, params = { emitEvent: true }) {
        this.startValue = product;
        if (this.isNew) {
            this.setNameValidators();
            this.startValue.inactive = false;
        } else {
            this.removeNameValidators();
        }

        this.setProductionStages(this.startValue.productionStages);

        super.initValue(this.startValue, params);
    }

    get value(): Product {
        return {
            ...super.value,
            name: super.value.name.trim(),
        };
    }

    updateEntity(): Observable<Product> {
        return this.productService.updateProduct(this.value);
    }

    createEntity(): Observable<string> {
        return this.productService.insertProduct(this.value);
    }

    addProductionStage(prStage?: JobProductionStage) {
        this.productionStages.push(
            new ProductionStageGroup(prStage)
        );
        this.form.markAsDirty();
    }

    removeProductionStage(idx: number) {
        this.productionStages.removeAt(idx);
        this.form.markAsDirty();
    }

    private setNameValidators() {
        this.form.controls.name.setAsyncValidators(this.nameAsyncValidator('name'));
    }
    private removeNameValidators() {
        this.form.controls.name.clearAsyncValidators();
    }

    private setProductionStages(stages: JobProductionStage[] | undefined) {
        this.productionStages.clear();
        for (const stage of stages || []) {
            this.productionStages.push(
                new ProductionStageGroup(stage),
                { emitEvent: false }
            );
        }
    }

    private nameAsyncValidator(key: keyof Product): AsyncValidatorFn {
        return (control: IFormControl<string>): Observable<ValidationErrors | null> => this.productService.validate(key, control.value.trim()).pipe(
            map(valid => valid ? null : { occupied: control.value })
        );
    }


}

export class ProductionStageGroup extends UntypedFormGroup {

    constructor(stage?: Partial<JobProductionStage>) {
        const materials = new UntypedFormArray(
            (stage?.materials || []).map(material => new MaterialGroup(material))
        );
        super({
            productionStageId: new UntypedFormControl(stage?.productionStageId),
            materials: materials,
            amount: new UntypedFormControl(stage?.amount || 0),
            fixedAmount: new UntypedFormControl(stage?.fixedAmount || 0),
        });
    }

}

export class MaterialGroup extends UntypedFormGroup {
    constructor(material?: Partial<JobProductionStageMaterial>) {
        super({
            materialId: new UntypedFormControl(
                material?.materialId,
                [Validators.required],
            ),
            amount: new UntypedFormControl(
                material?.amount || 0,
                [Validators.required, Validators.min(0)]
            ),
            fixedAmount: new UntypedFormControl(
                material?.fixedAmount || 0,
                [Validators.required, Validators.min(0)]
            )
        });
    }
}
