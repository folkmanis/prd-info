import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output, Signal, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteTripStop } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TripStopDialogComponent, TripStopDialogData } from './trip-stop-dialog/trip-stop-dialog.component';
import { firstValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { configuration } from 'src/app/services/config.provider';
import { ShippingAddress } from 'src/app/interfaces';
import { CdkDropList, CdkDrag, moveItemInArray, CdkDragDrop, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-trip-stops',
  standalone: true,
  imports: [MatIcon, MatIconButton, MatDivider, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './trip-stops.component.html',
  styleUrl: './trip-stops.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TripStopsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TripStopsComponent),
      multi: true,
    },
  ],
})
export class TripStopsComponent implements ControlValueAccessor, Validator {
  private dialog = inject(MatDialog);
  private homeAddress = configuration('transportation', 'shippingAddress');
  private homeName = configuration('system', 'companyName');

  customers = input<TransportationCustomer[]>([]);

  isDisabled = signal(false);

  validationErrors: Signal<ValidationErrors> = computed(() => {
    if (this.tripStops().length < 2) {
      return { count: 'too few stops' };
    }
    return null;
  });

  tripStops = signal<RouteTripStop[]>([]);

  canCalculateRoute = computed(() => this.validationErrors() == null && !this.isDisabled());

  calculateRoute = output<void>();

  onChange = (_: RouteTripStop[]) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.tripStops.set(Array.isArray(obj) ? obj : []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(): ValidationErrors | null {
    return this.validationErrors();
  }

  async onAddHome() {
    const home = this.homeAddress();
    if (!home) {
      return;
    }
    const data: RouteTripStop = {
      name: this.homeName(),
      address: home.address,
      googleLocationId: home.googleId,
    };
    this.tripStops.update((stops) => [...stops, data]);
    this.onChange(this.tripStops());
  }

  async onAddStop() {
    const data: TripStopDialogData = {
      customers: this.customers(),
    };
    const result$ = this.dialog.open(TripStopDialogComponent, { data, autoFocus: 'first-tabbable' }).afterClosed();
    const result = await firstValueFrom(result$);
    if (result) {
      this.tripStops.update((stops) => [...stops, result]);
      this.onChange(this.tripStops());
    }
  }

  async onEditStop(idx: number) {
    const data: TripStopDialogData = {
      customers: this.customers(),
      tripStop: this.tripStops()[idx],
    };
    const result$ = this.dialog.open(TripStopDialogComponent, { data, autoFocus: 'dialog' }).afterClosed();
    const result = await firstValueFrom(result$);
    if (result) {
      this.tripStops.update((stops) => stops.map((stop, i) => (i === idx ? result : stop)));
      this.onChange(this.tripStops());
    }
  }

  onDeleteStop(idx: number) {
    this.tripStops.update((stops) => stops.filter((_, i) => idx !== i));
    this.onChange(this.tripStops());
  }

  onDrop(event: CdkDragDrop<RouteTripStop[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const stops = [...this.tripStops()];
    moveItemInArray(stops, event.previousIndex, event.currentIndex);
    this.tripStops.set(stops);
    this.onChange(this.tripStops());
  }
}
