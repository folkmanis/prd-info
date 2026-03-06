import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField, required, submit } from '@angular/forms/signals';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteStop } from 'src/app/transportation/interfaces/transportation-route-sheet';

export interface TripStopDialogData {
  customers: TransportationCustomer[];
  tripStop?: RouteStop;
}

@Component({
  selector: 'app-trip-stop-dialog',
  imports: [
    FormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatFormFieldModule,
    MatInput,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
  ],
  templateUrl: './trip-stop-dialog.component.html',
  styleUrl: './trip-stop-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripStopDialogComponent {
  #data = inject<TripStopDialogData>(MAT_DIALOG_DATA);
  #dialogRef = inject(MatDialogRef);

  #tripStopModel = signal({
    customerId: this.#data.tripStop?.customerId ?? '',
    name: this.#data.tripStop?.name ?? '',
    address: this.#data.tripStop?.address ?? '',
    googleLocationId: this.#data.tripStop?.googleLocationId ?? '',
  });

  protected tripStopForm = form(this.#tripStopModel, (s) => {
    required(s.name);

    required(s.address);

    debounce(s.name, 100);
  });

  protected filteredCustomers = computed(() => this.filterCustomers(this.tripStopForm.name().value()));

  onSubmit() {
    submit(this.tripStopForm, async (schema) => {
      if (schema().valid() === false) {
        return;
      }
      const value = schema().value();
      const stop: RouteStop = {
        name: value.name,
        address: value.address,
        customerId: value.customerId || null,
        googleLocationId: value.googleLocationId || null,
      };
      this.#dialogRef.close(stop);
    });
  }

  onSetCustomer(event: MatAutocompleteSelectedEvent) {
    const customer = this.#data.customers.find((c) => c.CustomerName === event.option.value);
    if (customer) {
      this.#tripStopModel.set({
        customerId: customer._id,
        address: customer.shippingAddress?.address ?? '',
        googleLocationId: customer.shippingAddress?.googleId ?? '',
        name: customer.CustomerName,
      });
    }
  }

  private filterCustomers(value: string): TransportationCustomer[] {
    const filterValue = value.toUpperCase();
    return this.#data.customers.filter((customer) => customer.CustomerName.toUpperCase().includes(filterValue));
  }
}
