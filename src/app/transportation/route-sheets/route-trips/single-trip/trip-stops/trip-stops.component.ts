import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { notNullOrThrow } from 'src/app/library';
import { configuration } from 'src/app/services/config.provider';
import { TransportationCustomer } from 'src/app/transportation/route-sheets/schemas/transportation-customer';
import { TripStopDialogComponent, TripStopDialogData } from './trip-stop-dialog/trip-stop-dialog.component';
import { RouteTripStop } from '../../../schemas';
import { TripStopModel } from './trip-stop-dialog/trip-stop-model.schema';

@Component({
  selector: 'app-trip-stops',
  imports: [MatIcon, MatIconButton, MatDivider, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './trip-stops.component.html',
  styleUrl: './trip-stops.component.scss',
})
export class TripStopsComponent implements FormValueControl<TripStopModel[]> {
  value = model.required<TripStopModel[]>();

  customers = input<TransportationCustomer[] | null>([]);

  disabled = input(false);

  invalid = input(false);

  #dialog = inject(MatDialog);
  #homeAddress = configuration('transportation', 'shippingAddress');
  #homeName = configuration('system', 'companyName');

  calculateRoute = output<void>();

  async onAddHome() {
    const home = this.#homeAddress();
    if (!home) {
      return;
    }
    const data: TripStopModel = {
      name: this.#homeName(),
      address: home.address,
      googleLocationId: home.googleId ?? '',
      customerId: '',
    };
    this.value.update((stops) => [...stops, data]);
  }

  async onAddStop() {
    const customers = notNullOrThrow(this.customers());
    const data: TripStopDialogData = {
      customers,
      tripStop: {
        customerId: '',
        name: '',
        address: '',
        googleLocationId: '',
      },
    };
    const result$ = this.#dialog.open(TripStopDialogComponent, { data, autoFocus: 'first-tabbable' }).afterClosed();
    const result = await firstValueFrom(result$);
    if (result) {
      this.value.update((stops) => [...stops, result]);
    }
  }

  async onEditStop(idx: number) {
    const customers = notNullOrThrow(this.customers());
    const data: TripStopDialogData = {
      customers,
      tripStop: this.value()[idx],
    };
    const result$ = this.#dialog.open(TripStopDialogComponent, { data, autoFocus: 'dialog' }).afterClosed();
    const result = await firstValueFrom(result$);
    if (result) {
      this.value.update((stops) => stops.map((stop, i) => (i === idx ? result : stop)));
    }
  }

  onDeleteStop(idx: number) {
    this.value.update((stops) => stops.filter((_, i) => idx !== i));
  }

  onDrop(event: CdkDragDrop<RouteTripStop[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const stops = [...this.value()];
    moveItemInArray(stops, event.previousIndex, event.currentIndex);
    this.value.set(stops);
  }
}
