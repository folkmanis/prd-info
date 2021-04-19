import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { JobsWithoutInvoicesTotals } from 'src/app/interfaces';

type CustomerSelect = JobsWithoutInvoicesTotals & {
  displayname: string;
};

const ALL_CUSTOMER: CustomerSelect = {
  _id: 'all',
  displayname: 'Visi',
  jobs: 0,
  totals: 0,
  noPrice: 0,
};

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSelectorComponent implements OnInit, OnChanges {

  customersSelect: CustomerSelect[] = [ALL_CUSTOMER];
  customersFiltered$: Observable<CustomerSelect[]>;

  @Input() customers: JobsWithoutInvoicesTotals[] = [];

  @Input() customer: string | undefined;

  customerControl: IFormControl<CustomerSelect> = new FormControl(
    undefined,
    { validators: [this.customerValidatorFn()] }
  );

  @Output() customerChanges: Observable<string> = this.customerControl.valueChanges.pipe(
    filter(_ => this.customerControl.valid),
    map(value => value._id),
    distinctUntilChanged(),
  );

  constructor() { }

  ngOnInit(): void {
    this.customersFiltered$ = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(val => val || ''),
      map(val => typeof val === 'string' ? val : val._id),
      map(val => this.filterCustomers(val)),
    );
  }

  ngOnChanges({ customer, customers }: SimpleChanges) {
    if (customers?.currentValue && customers.currentValue !== customers.previousValue) {
      this.customers = customers.currentValue;
      this.customersSelect = [
        {
          ...ALL_CUSTOMER,
          jobs: this.customers.reduce((acc, curr) => acc + curr.jobs, 0),
          totals: this.customers.reduce((acc, curr) => acc + curr.totals, 0),
          noPrice: this.customers.reduce((acc, curr) => acc + curr.noPrice, 0),
        },
        ...this.customers.map(val => ({ ...val, displayname: val._id }))
      ];
    }
    if (customer?.currentValue) { this.customer = customer.currentValue; }

    this.updateControlValue();
    this.customerControl.updateValueAndValidity({ emitEvent: false });

  }

  displayFn(value: CustomerSelect): string {
    if (!value?.displayname) { return ''; }
    return value.displayname + (value.noPrice > 0 ? ` (${value.noPrice})` : '');
  }

  private filterCustomers(name: string): CustomerSelect[] {
    const value = new RegExp(name, 'i');
    return this.customersSelect.filter(option => value.test(option._id));
  }

  private customerValidatorFn(): ValidatorFn {
    return (control: IFormControl<CustomerSelect>) => {
      const name = control.value?._id;
      return !!name && this.customersSelect.some(element => element._id === name) ? null : { invalid: name };
    };
  }

  private updateControlValue() {
    if (this.customerControl.value?._id === this.customer) { return; }
    const select: CustomerSelect = this.customersSelect.find(cust => cust._id === this.customer);
    if (select) {
      this.customerControl.setValue(select, { emitEvent: false });
    }
  }

}
