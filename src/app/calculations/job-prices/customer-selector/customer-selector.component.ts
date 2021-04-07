import { Component, OnInit, OnChanges, ChangeDetectionStrategy, Input, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import { log } from 'prd-cdk';

interface CustomerSelect {
  id: string;
  displayname: string;
}

const ALL_CUSTOMER: CustomerSelect = {
  id: 'all',
  displayname: 'Visi',
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

  @Input() customers: string[] = [];

  @Input() customer: string | undefined;

  customerControl: IFormControl<CustomerSelect> = new FormControl(
    undefined,
    { validators: [this.customerValidatorFn()] }
  );

  @Output() customerChanges: Observable<string> = this.customerControl.valueChanges.pipe(
    filter(_ => this.customerControl.valid),
    map(value => value.id),
    distinctUntilChanged(),
  );

  constructor() { }

  ngOnInit(): void {
    this.customersFiltered$ = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(val => val || ''),
      map(val => typeof val === 'string' ? val : val.id),
      map(val => this.filterCustomers(val)),
    );
  }

  ngOnChanges({ customer, customers }: SimpleChanges) {
    if (customers?.currentValue && customers.currentValue !== customers.previousValue) {
      this.customers = customers.currentValue;
      this.customersSelect = [ALL_CUSTOMER, ...this.customers.map(val => ({ id: val, displayname: val }))];
    }
    if (customer?.currentValue) { this.customer = customer.currentValue; }

    this.updateControlValue();
    this.customerControl.updateValueAndValidity({ emitEvent: false });

  }

  displayFn(value: CustomerSelect): string {
    return value?.displayname || '';
  }

  private filterCustomers(name: string): CustomerSelect[] {
    const value = new RegExp(name, 'i');
    return this.customersSelect.filter(option => value.test(option.id));
  }

  private customerValidatorFn(): ValidatorFn {
    return (control: IFormControl<CustomerSelect>) => {
      const name = control.value?.id;
      return !!name && this.customersSelect.some(element => element.id === name) ? null : { invalid: name };
    };
  }

  private updateControlValue() {
    if (this.customerControl.value?.id === this.customer) { return; }
    const select: CustomerSelect = this.customersSelect.find(cust => cust.id === this.customer);
    if (select) {
      this.customerControl.setValue(select, { emitEvent: false });
    }
  }

}
