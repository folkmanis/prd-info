import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { debounceTime, map, startWith } from 'rxjs';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteStop } from 'src/app/transportation/interfaces/transportation-route-sheet';

export interface TripStopDialogData {
  customers: TransportationCustomer[];
  tripStop?: RouteStop;
}

@Component({
  selector: 'app-trip-stop-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    AsyncPipe,
  ],
  templateUrl: './trip-stop-dialog.component.html',
  styleUrl: './trip-stop-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripStopDialogComponent {
  private data = inject<TripStopDialogData>(MAT_DIALOG_DATA);

  form = inject(FormBuilder).group({
    customerId: [this.data.tripStop?.customerId as string | null],
    name: [this.data.tripStop?.name ?? ('' as string), [Validators.required]],
    address: [this.data.tripStop?.address as string | null, [Validators.required]],
    googleLocationId: [this.data.tripStop?.googleLocationId as string | null],
  });

  filteredCustomers$ = this.form.controls.name.valueChanges.pipe(
    debounceTime(100),
    startWith(''),
    map((value) => this.filterCustomers(value || '')),
  );

  onSetCustomer(event: MatAutocompleteSelectedEvent) {
    const customer = this.data.customers.find((c) => c.CustomerName === event.option.value);
    if (customer) {
      this.form.patchValue({
        customerId: customer._id,
        address: customer.shippingAddress?.address ?? null,
        googleLocationId: customer.shippingAddress?.googleId ?? null,
      });
    }
  }

  private filterCustomers(value: string): TransportationCustomer[] {
    const filterValue = value.toUpperCase();
    return this.data.customers.filter((customer) => customer.CustomerName.toUpperCase().includes(filterValue));
  }
}
