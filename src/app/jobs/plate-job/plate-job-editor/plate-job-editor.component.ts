import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, AbstractControl, AsyncValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { tap, map, startWith } from 'rxjs/operators';
import { ProductsService, CustomersService } from '../../services';
import { Customer, CustomerPartial } from '../../services/customer';
import { Job } from '../../services/job';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.css']
})
export class PlateJobEditorComponent implements OnInit {
  @Input('job') set activeJob(_job: Job | undefined) {
    this.setFormValues(_job);
  }
  @Output() private jobChanges: EventEmitter<Partial<Job>> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { }

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
  });
  get customerControl(): AbstractControl { return this.jobForm.get('customer'); }
  get nameControl(): AbstractControl { return this.jobForm.get('name'); }

  customers$: Observable<CustomerPartial[]> = combineLatest([
    this.customersService.customers$,
    this.customerControl.valueChanges.pipe(
      startWith(''),
    ),
  ]).pipe(
    map(this.filterCustomer)
  );

  ngOnInit(): void {
  }

  onSave() {
    this.jobForm.markAsPristine();
    this.jobChanges.next(this.jobForm.value);
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
      );
    };
  }

  private setFormValues(job: Job | undefined): void {
    this.jobForm.reset({ customer: '' });
    if (job) {
      console.log(job);
      this.jobForm.patchValue(job, { emitEvent: false });
    }
  }
}
