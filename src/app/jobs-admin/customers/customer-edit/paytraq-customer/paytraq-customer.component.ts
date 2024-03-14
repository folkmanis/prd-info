import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Customer, CustomerFinancial } from 'src/app/interfaces';
import { PaytraqClient } from 'src/app/interfaces/paytraq';
import { PaytraqSearchHeaderComponent } from 'src/app/jobs-admin/paytraq-search-header/paytraq-search-header.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { PaytraqClientService } from '../../services/paytraq-client.service';
import { PaytraqCustomerTableComponent } from './paytraq-customer-table/paytraq-customer-table.component';


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
    },
  ],
  imports: [
    PaytraqCustomerTableComponent,
    ReactiveFormsModule,
    MaterialLibraryModule,
    PaytraqSearchHeaderComponent,
  ],
})
export class PaytraqCustomerComponent implements ControlValueAccessor {

  private paytraqService = inject(PaytraqClientService);

  private onChanges: (obj: CustomerFinancial | null) => void;
  private onTouched: () => void;

  customer = input.required<Partial<Customer> | null>();

  search = model('');

  searchDisabled = signal(false);

  clients = signal<PaytraqClient[] | null>(null);

  value = signal<CustomerFinancial | null>(null);

  constructor() {
    effect(() => {
      const value = this.value();
      this.onChanges(value);
    });
    effect(() => {
      const customer = this.customer();
      this.search.set(customer.financial?.clientName || customer.CustomerName || null);
    }, { allowSignalWrites: true });
  }

  writeValue(obj: CustomerFinancial | null) {
    this.clients.set(null);
    this.value.set(obj);
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

  onSearchClient() {
    this.onTouched();
    this.searchDisabled.set(true);
    this.paytraqService.getClients({ query: this.search().trim() }).subscribe((clients) => {
      this.clients.set(clients);
      this.searchDisabled.set(false);
    });
  }

  onClientSelected(client: PaytraqClient) {
    this.value.set({
      clientName: client.name,
      paytraqId: client.clientID,
    });
  }

  onClearValue() {
    this.value.set(null);
  }
}
