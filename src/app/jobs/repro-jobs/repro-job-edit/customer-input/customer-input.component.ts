import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { IControlValueAccessor, IFormControl } from '@rxweb/types';
import { CustomerPartial, CustomerProduct, Job, JobBase, SystemPreferences } from 'src/app/interfaces';
import { BehaviorSubject, combineLatest, merge, Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { log } from 'prd-cdk';

@Component({
  selector: 'app-customer-input',
  templateUrl: './customer-input.component.html',
  styleUrls: ['./customer-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInputComponent implements OnInit {

  @ViewChild('customerInput') private input: ElementRef<HTMLInputElement>;

  @Input() control: IFormControl<string>;

  @Input() set customers(value: CustomerPartial[]) {
    if (!(value instanceof Array)) { return; }
    this.customers$.next(
      value.filter(cust => !cust.disabled)
    );
  }
  private customers$ = new BehaviorSubject<CustomerPartial[]>([]);

  @Input() set required(value: any) {
    this._required = coerceBooleanProperty(value);
  }
  get required(): any {
    return this._required;
  }
  private _required = false;

  customersFiltered$: Observable<CustomerPartial[]>;

  constructor() { }

  ngOnInit(): void {
    this.customersFiltered$ = combineLatest([
      this.customers$,
      this.control.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(this.filterCustomer),
    );

  }

  focus() {
    this.input.nativeElement.focus();
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue = new RegExp(value || '', 'i');
    return customers.filter(state => filterValue.test(state.CustomerName));
  }

}
