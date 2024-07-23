import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PaytraqShippingAddress } from 'src/app/interfaces/paytraq';

export interface PaytraqShippingAddressSelectDialogData {
  paytraqAddresses: Promise<PaytraqShippingAddress[]>;
}

@Component({
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatListModule, AsyncPipe, MatIcon],
  templateUrl: './paytraq-shipping-address-select-dialog.component.html',
  styleUrl: './paytraq-shipping-address-select-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqShippingAddressSelectDialogComponent {
  data: PaytraqShippingAddressSelectDialogData = inject(MAT_DIALOG_DATA);
}
