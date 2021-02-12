import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Input } from '@angular/core';
import { NgControl, FormBuilder, FormControl } from '@angular/forms';
import { IFormBuilder, IFormGroup, IControlValueAccessor, IFormControl } from '@rxweb/types';
import { SystemPreferencesService } from 'src/app/services';
import { Customer, CustomerFinancial } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx';
import { map, pluck, takeUntil } from 'rxjs/operators';
import { PaytraqClientService } from '../../services/paytraq-client.service';
import { Subject } from 'rxjs';
import { PaytraqClient } from 'src/app/interfaces/paytraq';
import { MatButton } from '@angular/material/button';

const DEFAULT_VALUE: CustomerFinancial = {
  clientName: '',
  paytraqId: undefined,
};

@Component({
  selector: 'app-paytraq-customer',
  templateUrl: './paytraq-customer.component.html',
  styleUrls: ['./paytraq-customer.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqCustomerComponent implements OnInit, OnDestroy, IControlValueAccessor<CustomerFinancial> {

  @Input() set customer(customer: Customer) {
    this.clientSearch.setValue(
      customer.financial?.paytraqId ? '' : customer.financial?.clientName || customer.CustomerName
    );
  }
  private onChanges: (obj: CustomerFinancial | null) => void;
  private onTouched: () => void;

  clients$ = new Subject<PaytraqClient[]>();

  clientSearch: IFormControl<string> = new FormControl('');

  get value(): CustomerFinancial { return this._value; }
  set value(value: CustomerFinancial) { this._value = value; }
  private _value: CustomerFinancial;

  constructor(
    private ngControl: NgControl,
    private destroy$: DestroyService,
    private paytraqService: PaytraqClientService,
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: CustomerFinancial) {
    this.clients$.next([]);
    this.value = { ...DEFAULT_VALUE, ...obj };
  }

  registerOnChange(fn: (obj: CustomerFinancial | null) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.clientSearch.reset();
      this.clientSearch.disable();
    } else {
      this.clientSearch.enable();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.clients$.complete();
  }

  onSearchClient(ev: string, button: MatButton) {
    button.disabled = true;
    this.onTouched();
    this.paytraqService.getClients({ query: ev })
      .subscribe(clients => {
        this.clients$.next(clients);
        button.disabled = false;
      });
  }

  onClientSelected(ev: PaytraqClient) {
    this.value = {
      clientName: ev.name,
      paytraqId: ev.clientID,
    };
    this.onChanges(this.value);
  }

  onClearValue() {
    this.value = null;
    this.onChanges(this.value);
  }

}
