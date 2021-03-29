import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
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
export class CustomerSelectorComponent implements OnInit {

  customersSelect: CustomerSelect[] = [];

  @Input() set customers(value: string[]) {
    if (!value) { return; }
    this.customersSelect = [ALL_CUSTOMER, ...value.map(val => ({ id: val, displayname: val }))];
    this.updateControlValue();
    this.customerControl.updateValueAndValidity();
  }

  @Input() set customer(value: string) {
    this._customer = value || '';
    this.updateControlValue();
  }
  get customer(): string {
    return this._customer;
  }
  private _customer: string = '';

  customerControl: IFormControl<CustomerSelect> = new FormControl(
    ALL_CUSTOMER,
    { validators: [this.customerValidatorFn()] }
  );

  @Output() customerChanges: Observable<string> = this.customerControl.valueChanges.pipe(
    filter(_ => this.customerControl.valid),
    map(value => value.id),
    log('value'),
  );

  customersFiltered$: Observable<CustomerSelect[]>;

  constructor() { }

  ngOnInit(): void {
    this.customersFiltered$ = this.customerControl.valueChanges.pipe(
      startWith(''),
      map(val => val || ''),
      map(val => typeof val === 'string' ? val : val.id),
      map(val => this.filterCustomers(val)),
      log('customers filtered'),
    );
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
    const select: CustomerSelect = this.customersSelect.find(cust => cust.id === this.customer) || ALL_CUSTOMER;
    this.customerControl.setValue(select, { emitEvent: false });
  }

}
