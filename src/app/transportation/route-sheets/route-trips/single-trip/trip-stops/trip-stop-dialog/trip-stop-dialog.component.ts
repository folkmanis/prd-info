import { Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField, FormRoot, required } from '@angular/forms/signals';
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
import { TransportationCustomer } from '../../../../schemas';
import { customerToModel, TripStopModel } from './trip-stop-model.schema';

export interface TripStopDialogData {
  customers: TransportationCustomer[];
  tripStop: TripStopModel;
}

@Component({
  selector: 'app-trip-stop-dialog',
  imports: [
    FormField,
    FormRoot,
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
})
export class TripStopDialogComponent {
  #data = inject<TripStopDialogData>(MAT_DIALOG_DATA);
  #dialogRef = inject(MatDialogRef);

  #tripStopModel = signal(this.#data.tripStop);

  protected tripStopForm = form(
    this.#tripStopModel,
    (s) => {
      required(s.name);
      required(s.address);
      debounce(s.name, 100);
    },
    {
      submission: {
        action: async (schema) => {
          this.#dialogRef.close(schema().value());
        },
      },
    },
  );

  protected filteredCustomers = computed(() => this.#filterCustomers(this.tripStopForm.name().value()));

  protected onSetCustomer(event: MatAutocompleteSelectedEvent) {
    const customer = this.#data.customers.find((c) => c.customerName === event.option.value);
    if (customer) {
      this.#tripStopModel.set(customerToModel(customer));
    }
  }

  #filterCustomers(value: string): TransportationCustomer[] {
    const filterValue = value.toUpperCase();
    return this.#data.customers.filter((customer) => customer.customerName.toUpperCase().includes(filterValue));
  }
}
