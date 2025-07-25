import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, firstValueFrom, map } from 'rxjs';
import { ShippingAddress } from 'src/app/interfaces';
import { PaytraqShippingAddress } from 'src/app/interfaces/paytraq';
import { notNullOrThrow } from 'src/app/library';
import { LocationSelectService } from 'src/app/library/location-select';
import { configuration } from 'src/app/services/config.provider';
import { PaytraqClientService } from '../../services/paytraq-client.service';
import {
  PaytraqShippingAddressSelectDialogComponent,
  PaytraqShippingAddressSelectDialogData,
} from './paytraq-shipping-address-select-dialog/paytraq-shipping-address-select-dialog.component';

@Component({
  selector: 'app-shipping-address',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput, MatSelectModule, MatButton, MatIconButton, MatIcon],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ShippingAddressComponent,
      multi: true,
    },
  ],
})
export class ShippingAddressComponent implements ControlValueAccessor {
  private dialog = inject(MatDialog);
  private paytraqService = inject(PaytraqClientService);
  private locationSelect = inject(LocationSelectService);

  paytraqEnabled = configuration('paytraq', 'enabled');

  paytraqClientId = input<number | null>();

  onTouchFn = () => {};

  form = inject(FormBuilder).group({
    address: ['', [Validators.required]],
    zip: ['', [Validators.required]],
    country: ['', [Validators.required]],
    paytraqId: [null as number | null],
    googleId: [''],
  });

  value$ = this.form.events.pipe(
    filter((event) => event instanceof ValueChangeEvent),
    map((event: ValueChangeEvent<ShippingAddress>) => (event.source.valid ? event.value : null)),
    distinctUntilChanged(isEqual),
  );

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.value$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  async onAddressMap() {
    const address = notNullOrThrow(this.form.value.address);
    const marker = await firstValueFrom(this.locationSelect.getLocation({ address }));
    if (marker) {
      this.form.patchValue({
        address: marker.address,
        googleId: marker.googleId,
        zip: marker.zip,
        country: marker.country,
      });
    }
  }

  async onPaytraq() {
    const id = this.paytraqClientId();
    if (typeof id !== 'number') {
      return;
    }
    const paytraqAddresses = this.paytraqService.getClientShippingAddresses(id);
    const config: MatDialogConfig<PaytraqShippingAddressSelectDialogData> = {
      data: {
        paytraqAddresses,
      },
    };
    const result: PaytraqShippingAddress | undefined = await firstValueFrom(this.dialog.open(PaytraqShippingAddressSelectDialogComponent, config).afterClosed());
    if (!result) {
      return;
    }
    this.form.patchValue({
      address: result.address,
      zip: result.zip,
      country: result.country,
      paytraqId: result.addressID,
    });
  }

  onReset() {
    this.form.reset();
  }
}
