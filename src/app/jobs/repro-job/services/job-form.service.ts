import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { JobService } from 'src/app/services/job.service';
import { ProductsService } from 'src/app/services/products.service';
import { FileUploadService } from './file-upload.service';
import { IFormArray, IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { endOfDay } from 'date-fns';


@Injectable({
  providedIn: 'any'
})
export class JobFormService {

  private fb: IFormBuilder;

  folderPath$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { this.fb = fb; }

  createJobForm(): IFormGroup<JobBase> {
    const jobForm: IFormGroup<JobBase> = this.fb.group<JobBase>(
      {
        jobId: [undefined],
        customer: [
          '',
          {
            validators: Validators.required,
            asyncValidators: this.validateCustomerFn(),
          },
        ],
        name: [
          undefined,
          {
            validators: Validators.required,
          },
        ],
        receivedDate: [
          new Date(),
          {
            validators: Validators.required,
          }
        ],
        dueDate: [
          new Date(),
          {
            validators: Validators.required,
          }
        ],
        category: [
          undefined,
          {
            validators: Validators.required,
          }
        ],
        comment: [undefined],
        customerJobId: [undefined],
        custCode: [{ value: undefined, disabled: true }],
        jobStatus: this.fb.group({
          generalStatus: 10,
        }),
        products: this.fb.array([]),
        files: [undefined],
      });
    return jobForm;
  }

  private validateCustomerFn(): AsyncValidatorFn {
    return (control: IFormControl<string>): Observable<ValidationErrors | null> => {
      const value = control.value;
      return this.customersService.customers$.pipe(
        map(customers =>
          customers.some(customer => customer.CustomerName === value) ? null : { noCustomer: `Klients ${value} nav atrasts` }
        ),
        take(1),
      );
    };
  }

  productFormGroup(product?: Partial<JobProduct>): IFormGroup<JobProduct> {
    const _group = this.fb.group<JobProduct>({
      name: [
        product?.name,
        {
          validators: [Validators.required],
          asyncValidators: [this.productNameValidatorFn()],
        }
      ],
      price: [
        product?.price,
        {
          validators: [Validators.min(0)],
        }
      ],
      count: [
        product?.count || 0,
        {
          validators: [Validators.min(0)],
        }
      ],
      units: [
        product?.units,
        {
          validators: [Validators.required],
        }
      ],
      comment: [product?.comment],
    });
    return _group;
  }

  private productNameValidatorFn(): AsyncValidatorFn {
    return (control: IFormControl<string>) => {
      const val = control.value;
      return this.productsService.products$.pipe(
        take(1),
        map(products => products.some(prod => prod.name === val)),
        map(is => is ? null : { invalidProduct: 'Prece nav atrasta katalogā' }),
      );
    };
  }

  initValue(form: IFormGroup<JobBase>, value: Partial<JobBase>, params?: { emitEvent: boolean; }): void {
    this.setProductsControls(form.get('products') as unknown as IFormArray<JobProduct>, value?.products as JobProduct[] || []);
    form.reset(undefined, params);
    form.patchValue(value, params);
    form.markAsPristine();

    if (value.invoiceId) {
      form.disable({ emitEvent: false });
    } else {
      form.enable({ emitEvent: false });
    }
    if (value.receivedDate) {
      form.get('receivedDate').disable({ emitEvent: false });
    }
    form.markAsPristine();
    this.folderPath$.next(value.files?.path?.join('/') || '');
  }

  setProductsControls(controls: IFormArray<JobProduct>, products: JobProduct[]) {
    if (controls.length) { controls.clear(); }
    for (const prod of products) {
      this.addProduct(controls);
    }
  }

  addProduct(controls: IFormArray<JobProduct>) {
    controls.push(this.productFormGroup());
    controls.markAsDirty();
  }

  removeProduct(controls: IFormArray<JobProduct>, idx: number) {
    controls.removeAt(idx);
    controls.markAsDirty();
  }


}
