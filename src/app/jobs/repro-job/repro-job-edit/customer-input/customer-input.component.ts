import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { IControlValueAccessor, IFormControl } from '@rxweb/types';
import { CustomerPartial, CustomerProduct, Job, JobBase, SystemPreferences } from 'src/app/interfaces';
import { BehaviorSubject, combineLatest, merge, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-customer-input',
  templateUrl: './customer-input.component.html',
  styleUrls: ['./customer-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInputComponent implements OnInit, AfterViewInit, IControlValueAccessor<string> {

  @ViewChild('customerInput') private input: ElementRef<HTMLInputElement>;

  @Input() set customers(value: CustomerPartial[]) {
    this.customers$.next(value || []);
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

  inputControl: IFormControl<string> = new FormControl();

  get control() {
    return this.ngControl.control;
  }

  valueChangeFn: (obj: string) => void;
  touchFn: () => void;

  constructor(
    private ngControl: NgControl,
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: string) {
    this.inputControl.setValue(obj);
  }

  registerOnChange(fn: (obj: string) => void) {
    this.valueChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  ngOnInit(): void {
    this.customersFiltered$ = combineLatest([
      this.customers$.pipe(
        map(customers => customers.filter(cust => !cust.disabled)),
      ),
      merge(
        // this.form.valueChanges.pipe(mapTo('')),
        this.inputControl.valueChanges,
        of(''),
      )
    ]).pipe(
      map(this.filterCustomer)
    );

    this.inputControl.valueChanges.subscribe(val => this.valueChangeFn(val));
  }

  ngAfterViewInit(): void {
  }

  focus() {
    this.input.nativeElement.focus();
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue = new RegExp(value, 'i');
    return customers.filter(state => filterValue.test(state.CustomerName));
  }


}
