import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { Customer, CustomerFinancial } from 'src/app/interfaces';
import { PaytraqClient } from 'src/app/interfaces/paytraq';
import { PaytraqClientService } from '../../services/paytraq-client.service';
import { PaytraqCustomerTableComponent } from './paytraq-customer-table/paytraq-customer-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

const DEFAULT_VALUE: CustomerFinancial = {
  clientName: '',
  paytraqId: undefined,
};

@Component({
  selector: 'app-paytraq-customer',
  standalone: true,
  templateUrl: './paytraq-customer.component.html',
  styleUrls: ['./paytraq-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PaytraqCustomerComponent,
      multi: true,
    }
  ],
  imports: [
    PaytraqCustomerTableComponent,
    CommonModule,
    ReactiveFormsModule,
    MaterialLibraryModule,
  ]
})
export class PaytraqCustomerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() set customer(customer: Partial<Pick<Customer, 'financial' | 'CustomerName'>>) {
    this.clientSearch.setValue(
      customer.financial?.paytraqId ? '' : customer.financial?.clientName || customer.CustomerName
    );
  }
  private onChanges: (obj: CustomerFinancial | null) => void;
  private onTouched: () => void;

  clients$ = new Subject<PaytraqClient[]>();

  clientSearch = new FormControl<string>('');

  get value(): CustomerFinancial { return this._value; }
  set value(value: CustomerFinancial) { this._value = value; }
  private _value: CustomerFinancial;

  constructor(
    private paytraqService: PaytraqClientService,
  ) { }

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
