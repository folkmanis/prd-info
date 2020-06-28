import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, ValidationErrors, Validators, FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, tap, shareReplay, startWith, take, filter } from 'rxjs/operators';
import { CustomerPartial, Job, CustomerProduct, JobsSettings } from 'src/app/interfaces';
import { CustomersService, SystemPreferencesService } from 'src/app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.css']
})
export class PlateJobEditorComponent implements OnInit, OnDestroy {
  @ViewChild('customerInput', { read: MatInput, static: true }) customerInput: MatInput;
  @Input() jobFormGroup: FormGroup;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  constructor(
    private customersService: CustomersService,
    private sysPref: SystemPreferencesService,
  ) { }

  get customerControl(): FormControl { return this.jobFormGroup.get('customer') as FormControl; }
  get nameControl(): FormControl { return this.jobFormGroup.get('name') as FormControl; }
  get productsControl(): FormArray { return this.jobFormGroup.get('products') as FormArray; }

  customers$: Observable<CustomerPartial[]>;
  jobStates$ = (this.sysPref.getModulePreferences('jobs') as Observable<JobsSettings>).pipe(
    map(pref => pref.jobStates.filter(st => st.state < 50))
  );

  receivedDate = {
    min: moment().startOf('week'),
    max: moment().endOf('week'),
  };

  ngOnInit(): void {
    this.customers$ = combineLatest([
      this.customersService.customers$.pipe(
        map(customers => customers.filter(cust => !cust.disabled)),
      ),
      this.customerControl.valueChanges.pipe(
        startWith(''),
      ),
    ]).pipe(
      map(this.filterCustomer)
    );
  }

  ngOnDestroy(): void {
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  jobIdAndName(): string {
    return `${this.jobFormGroup.get('jobId').value}-${this.jobFormGroup.get('name').value}`;
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue: string = value.toLowerCase();
    return customers.filter(state => state.CustomerName.toLowerCase().indexOf(filterValue) === 0);
  }


}
