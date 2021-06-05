import { FormBuilder } from '@angular/forms';
import { IFormArray } from '@rxweb/types';
import { BehaviorSubject } from 'rxjs';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { JobFormService } from './job-form.service';

export class JobFormSource extends SimpleFormSource<JobBase> {

    folderPath$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(
        fb: FormBuilder,
        private jobFormService: JobFormService,
    ) {
        super(fb);
    }

    insertFn = this.jobFormService.insertFn();

    updateFn = this.jobFormService.updateFn();

    get isNew(): boolean {
        return !this.form.value.jobId;
    }

    get prodControl(): IFormArray<JobProduct> {
        return this.form.controls.products as IFormArray<JobProduct>;
    }

    createForm = this.jobFormService.createJobForm;

    initValue(value: Partial<JobBase>, params?: { emitEvent: boolean; }): void {
        this.setProductsControls(value?.products as JobProduct[] || []);
        super.initValue(value, params);
        if (value.invoiceId) {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
        if (value.receivedDate) {
            this.form.get('receivedDate').disable({ emitEvent: false });
        }
        this.form.markAsPristine();
        this.folderPath$.next(value.files?.path?.join('/') || '');
    }

    setProductsControls(products: JobProduct[]) {
        if (this.prodControl.length) { this.prodControl.clear(); }
        for (const prod of products) {
            this.addProduct();
        }
    }

    addProduct() {
        this.prodControl.push(this.jobFormService.productFormGroup());
        this.form.controls.products.markAsDirty();
    }

    removeProduct(idx: number) {
        this.prodControl.removeAt(idx);
        this.form.controls.products.markAsDirty();
    }

}
