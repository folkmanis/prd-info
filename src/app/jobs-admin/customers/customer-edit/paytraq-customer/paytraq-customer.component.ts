import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
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
import { PaytraqSearchHeaderComponent } from 'src/app/jobs-admin/paytraq-search-header/paytraq-search-header.component';

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
    PaytraqSearchHeaderComponent,
  ]
})
export class PaytraqCustomerComponent implements ControlValueAccessor {

  @Input() set customer(customer: Partial<Pick<Customer, 'financial' | 'CustomerName'>>) {
    this.initialSearch.set(
      customer.financial?.paytraqId ? '' : customer.financial?.clientName || customer.CustomerName
    );
  }
  private onChanges: (obj: CustomerFinancial | null) => void;
  private onTouched: () => void;

  initialSearch = signal('');
  searchDisabled = signal(false);

  clients = signal<PaytraqClient[] | null>(null);


  get value(): CustomerFinancial { return this._value; }
  set value(value: CustomerFinancial) { this._value = value; }
  private _value: CustomerFinancial;

  constructor(
    private paytraqService: PaytraqClientService,
  ) { }

  writeValue(obj: CustomerFinancial) {
    this.clients.set(null);
    this.value = { ...DEFAULT_VALUE, ...obj };
  }

  registerOnChange(fn: (obj: CustomerFinancial | null) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.searchDisabled.set(isDisabled);
  }

  onSearchClient(ev: string) {
    this.onTouched();
    this.searchDisabled.set(true);
    this.paytraqService.getClients({ query: ev })
      .subscribe(clients => {
        this.clients.set(clients);
        this.searchDisabled.set(false);
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
