import { inject, Service } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom, map } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { CustomerFinancial, ShippingAddressModel } from 'src/app/interfaces';
import { PaytraqShippingAddress } from 'src/app/interfaces/paytraq';
import { LocationSelectService } from 'src/app/library/location-select';
import { PaytraqClientService } from '../services/paytraq-client.service';
import {
  PaytraqCustomerSelectComponent,
  PaytraqCustomerSelectDialogData,
} from './paytraq-customer-select/paytraq-customer-select.component';
import {
  PaytraqShippingAddressSelectDialogComponent,
  PaytraqShippingAddressSelectDialogData,
} from './paytraq-shipping-address-select-dialog/paytraq-shipping-address-select-dialog.component';

@Service()
export class CustomerEditService {
  private dialog = inject(MatDialog);
  private paytraqService = inject(PaytraqClientService);
  private locationSelect = inject(LocationSelectService);
  private filesService = inject(JobFilesService);

  locationServiceEnabled = this.locationSelect.serviceEnabled;

  ftpFolders$ = this.filesService.ftpFolders().pipe(map((f) => f.filter((e) => e.isFolder).map((e) => e.name)));

  async selectPaytraqCustomer(customerName: string): Promise<CustomerFinancial | undefined> {
    const data: PaytraqCustomerSelectDialogData = {
      name: customerName,
      searchFn: (name) => this.paytraqService.getClients({ query: name.trim() }),
    };
    return firstValueFrom(this.dialog.open(PaytraqCustomerSelectComponent, { data }).afterClosed());
  }

  async getShippingMarker(
    address: string | undefined,
  ): Promise<Partial<Omit<ShippingAddressModel, 'paytraqId'>> | undefined> {
    const marker = await firstValueFrom(this.locationSelect.getLocation({ address }));
    if (!marker) {
      return;
    }
    return {
      address: marker.address,
      googleId: marker.googleId,
      zip: marker.zip,
      country: marker.country,
    };
  }

  async getPaytraqAddress(paytraqClientId: number): Promise<Omit<ShippingAddressModel, 'googleId'> | undefined> {
    const paytraqAddresses = this.paytraqService.getClientShippingAddresses(paytraqClientId);
    const config: MatDialogConfig<PaytraqShippingAddressSelectDialogData> = {
      data: {
        paytraqAddresses,
      },
    };
    const result: PaytraqShippingAddress | undefined = await firstValueFrom(
      this.dialog.open(PaytraqShippingAddressSelectDialogComponent, config).afterClosed(),
    );
    if (!result) {
      return;
    }
    return {
      address: result.address,
      zip: result.zip,
      country: result.country,
      paytraqId: result.addressID.toString(),
    };
  }
}
