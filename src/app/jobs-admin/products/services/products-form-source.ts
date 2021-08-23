import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product, ProductPrice, JobProductionStage, ProductionStage, JobProductionStageMaterial } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductsFormSource extends SimpleFormSource<Product> {

    constructor(
        fb: FormBuilder,
        private productService: ProductsService,
    ) {
        super(fb);
    }

    private get formPrices(): IFormArray<ProductPrice> {
        return this.form.controls.prices as IFormArray<ProductPrice>;
    }

    get productionStages() {
        return this.form.get('productionStages') as unknown as FormArray;
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
            productionStages: new FormArray([]),
        });

        return productForm;
    }

    initValue(product: Partial<Product>, params = { emitEvent: true }) {
        this.startValue = product;
        if (this.isNew) {
            this.setNameValidators();
        } else {
            this.removeNameValidators();
        }
        this.setPrices(product.prices);

        this.setProductionStages(product.productionStages);

        super.initValue(product, params);
    }

    get value(): Product {
        return {
            ...super.value,
            name: super.value.name.trim(),
        };
    }

    updateFn(prod: Product): Observable<Product> {
        return this.productService.updateProduct(prod).pipe(
            switchMap(_ => this.productService.getProduct(prod.name)),
        );
    }

    insertFn(prod: Product): Observable<string> {
        return this.productService.insertProduct(prod);
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

export class ProductionStageGroup extends FormGroup {

    constructor(stage?: Partial<JobProductionStage>) {
        const materials = new FormArray(
            (stage?.materials || []).map(material => new MaterialGroup(material))
        );
        super({
            productionStageId: new FormControl(stage?.productionStageId),
            materials: materials,
            amount: new FormControl(stage?.amount || 0),
            fixedAmount: new FormControl(stage?.fixedAmount || 0),
        });
    }

}

export class MaterialGroup extends FormGroup {
    constructor(material?: Partial<JobProductionStageMaterial>) {
        super({
            materialId: new FormControl(
                material?.materialId,
                [Validators.required],
            ),
            amount: new FormControl(
                material?.amount,
                [Validators.required, Validators.min(0)]
            ),
            fixedAmount: new FormControl(
                material?.fixedAmount,
            )
        });
    }
}
