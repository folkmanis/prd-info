import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output, Signal, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { notNullOrThrow } from 'src/app/library';
import { configuration } from 'src/app/services/config.provider';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteStop } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TripStopDialogComponent, TripStopDialogData } from './trip-stop-dialog/trip-stop-dialog.component';

@Component({
  selector: 'app-trip-stops',
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

  customers = input<TransportationCustomer[] | null>([]);

  isDisabled = signal(false);

  validationErrors: Signal<ValidationErrors | null> = computed(() => {
    if (this.tripStops().length < 2) {
      return { count: 'too few stops' };
    }
    return null;
  });

  tripStops = signal<RouteStop[]>([]);

  canCalculateRoute = computed(() => this.validationErrors() == null && !this.isDisabled());

  calculateRoute = output<void>();

  onChange = (_: RouteStop[]) => {};
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
    const data: RouteStop = {
      name: this.homeName(),
      address: home.address,
      googleLocationId: home.googleId,
    };
    this.tripStops.update((stops) => [...stops, data]);
    this.onChange(this.tripStops());
  }

  async onAddStop() {
    const customers = notNullOrThrow(this.customers());
    const data: TripStopDialogData = {
      customers,
    };
    const result$ = this.dialog.open(TripStopDialogComponent, { data, autoFocus: 'first-tabbable' }).afterClosed();
    const result = await firstValueFrom(result$);
    if (result) {
      this.tripStops.update((stops) => [...stops, result]);
      this.onChange(this.tripStops());
    }
  }

  async onEditStop(idx: number) {
    const customers = notNullOrThrow(this.customers());
    const data: TripStopDialogData = {
      customers,
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

  onDrop(event: CdkDragDrop<RouteStop[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const stops = [...this.tripStops()];
    moveItemInArray(stops, event.previousIndex, event.currentIndex);
    this.tripStops.set(stops);
    this.onChange(this.tripStops());
  }
}
