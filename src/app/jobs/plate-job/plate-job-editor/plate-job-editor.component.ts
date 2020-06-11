import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { CustomerPartial, Job } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.css']
})
export class PlateJobEditorComponent implements OnInit, OnDestroy {
  @ViewChild('customerInput', { read: MatInput, static: true }) customerInput: MatInput;
  @Input('job') set activeJob(_j: Partial<Job>) {
    this._job = _j || {};
    this.setFormValues();
  }
  get activeJob(): Partial<Job> { return this._job; }
  @Output() private jobChanges: EventEmitter<Partial<Job> | undefined> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private snack: MatSnackBar,
  ) { }

  _job: Partial<Job>;
  jobForm = this.fb.group({
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
    comment: [],
    customerJobId: [],
    products: this.fb.array([]),
  });
  get customerControl(): FormControl { return this.jobForm.get('customer') as FormControl; }
  get nameControl(): FormControl { return this.jobForm.get('name') as FormControl; }
  get productsControl(): FormArray { return this.jobForm.get('products') as FormArray; }

  customers$: Observable<CustomerPartial[]> = combineLatest([
    this.customersService.customers$,
    this.customerControl.valueChanges.pipe(
      startWith(''),
    ),
  ]).pipe(
    map(this.filterCustomer)
  );

  private _subs: Subscription;

  ngOnInit(): void {
    this._subs = this.jobForm.valueChanges.pipe(
      map(job => this.jobForm.valid && this.jobForm.dirty ? job : undefined),
    ).subscribe(this.jobChanges);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.activeJob.products instanceof Array && this.activeJob.products.length > 0);
  }

  onCopy(value: string) {
    this.snack.open(`${value} izkopēts!`, 'OK', { duration: 2000 });
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue: string = value.toLowerCase();
    return customers.filter(state => state.CustomerName.toLowerCase().indexOf(filterValue) === 0);
  }

  private validateCustomerFn(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      return this.customersService.customers$.pipe(
        map(customers =>
          customers.some(customer => customer.CustomerName === value) ? null : { noCustomer: `Klients ${value} nav atrasts` }
        ),
        take(1),
      );
    };
  }

  private setFormValues(): void {
    this.jobForm.reset({ customer: '' });
    this.jobForm.patchValue(this.activeJob, { emitEvent: false });
    if (!this.activeJob.invoiceId) {
      this.jobForm.enable();
    } else {
      this.jobForm.disable();
    }
  }

}
