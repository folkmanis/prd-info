import { AsyncValidatorFn, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
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

    private get formPrices(): IFormArray<ProductPrice> {
        return this.form.controls.prices as IFormArray<ProductPrice>;
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
            prices: this.fb.array(
                [],
                { validators: [this.duplicateCustomersValidator] }
            ),
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
        this.setPrices(this.startValue.prices);

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

    addPrice(price?: ProductPrice) {
        this.formPrices.push(this.productPriceGroup(price));
        this.form.markAsDirty();
    }

    removePrice(idx: number) {
        this.formPrices.removeAt(idx);
        this.form.markAsDirty();
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

    private setPrices(prodPrices: ProductPrice[] | undefined) {
        this.formPrices.clear();
        for (const prodPrice of prodPrices || []) {
            this.formPrices.push(
                this.productPriceGroup(prodPrice)
            );
        }
    }

    private productPriceGroup(price: ProductPrice): IFormGroup<ProductPrice> {
        return this.fb.group<ProductPrice>({
            customerName: [
                price?.customerName,
                [Validators.required],
            ],
            price: [
                price?.price,
                [
                    Validators.required,
                    Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)
                ]
            ],
        });
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

    private duplicateCustomersValidator(ctrl: IFormArray<ProductPrice>): ValidationErrors | null {
        const customers: string[] = (ctrl.value as ProductPrice[]).map(pr => pr.customerName);
        const duplicates: string[] = customers.filter((val, idx, self) => self.indexOf(val) !== idx);
        return duplicates.length === 0 ? null : { duplicates: duplicates.join() };
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
