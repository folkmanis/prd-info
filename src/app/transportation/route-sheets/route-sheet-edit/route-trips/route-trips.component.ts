import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, input, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { isEqual } from 'lodash-es';
import { HistoricalData } from 'src/app/transportation/interfaces/historical-data';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteTrip, RouteStop } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';
import { AccordionDirective } from 'src/app/transportation/ui/accordion.directive';
import { SingleTripComponent } from './single-trip/single-trip.component';
import { TripsTotalComponent } from '../../../ui/trips-total/trips-total.component';
import { assertArrayOfNotNull, numberOrDefaultZero } from 'src/app/library';

@Component({
  selector: 'app-route-trips',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    SingleTripComponent,
    MatExpansionModule,
    DatePipe,
    MatMenuModule,
    MatIcon,
    MatIconButton,
    AccordionDirective,
    TripsTotalComponent,
  ],
  templateUrl: './route-trips.component.html',
  styleUrl: './route-trips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RouteTripsComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RouteTripsComponent,
      multi: true,
    },
  ],
})
export class RouteTripsComponent implements ControlValueAccessor, Validator {
  private chDetector = inject(ChangeDetectorRef);
  private accordion = viewChild.required(MatAccordion, { read: AccordionDirective });

  form = new FormArray<FormControl<RouteTrip | null>>([]);

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  customers = input<TransportationCustomer[] | null>([]);

  vehicle = input<TransportationVehicle | null>();

  onTouched = () => {};

  historicalData = input<HistoricalData | null>(null);

  fuelUnits = computed(() => this.vehicle()?.fuelType?.units ?? '');

  startDate = input<Date | null>();

  writeValue(obj: RouteTrip[] | null): void {
    if ((obj?.length ?? 0) < this.form.length) {
      this.accordion().closeAll();
    }
    if (obj?.length === this.form.length) {
      this.form.reset(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj?.forEach((trip) => this.form.push(new FormControl(trip), { emitEvent: false }));
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      return this.form.controls.reduce((errors, control, idx) => (control.invalid ? { ...errors, [idx]: control.errors } : errors), {});
    }
  }

  onAppend() {
    const tripControl = new FormControl(null, [Validators.required]);
    this.form.push(tripControl);
    this.onTouched();
    this.chDetector.markForCheck();
    this.accordion().expandLast();
  }

  onRemove(index: number) {
    this.accordion().closeAll();
    this.form.removeAt(index);
    this.onTouched();
    this.chDetector.markForCheck();
  }

  getDescription(stops?: RouteStop[]): string | null {
    if (!stops || stops.length < 1) {
      return null;
    }
    return stops
      .map((stop) => stop.name)
      .filter(Boolean)
      .join(' - ');
  }

  onSortByDate() {
    assertArrayOfNotNull(this.form.value);
    const sorted = this.sortTripsByDate(this.form.value);
    if (!isEqual(this.form.value, sorted)) {
      this.form.setValue(sorted);
    }
  }

  lastOdometer(idx: number) {
    return computed(() => {
      const hData = this.historicalData();
      this.formValue();
      if (this.form.length === 1 && hData && this.form.value[idx]?.date && new Date(hData.lastYear, hData.lastMonth - 1) < this.form.value[idx]?.date) {
        return this.historicalData()?.lastOdometer || null;
      }
      if (this.form.value[idx]?.date) {
        return this.lastDistance(this.form.value[idx].date) ?? this.historicalData()?.lastOdometer ?? null;
      }
      return null;
    });
  }

  private sortTripsByDate(unsorted: RouteTrip[]): RouteTrip[] {
    const sorted = [...unsorted];
    sorted.sort((a, b) => +a.date - +b.date);
    return sorted;
  }

  private lastDistance(date: Date): number {
    return this.form.value
      .filter((d) => d && d.date < date && d.odoStopKm > 0)
      .map((d) => numberOrDefaultZero(d?.odoStopKm))
      .reduce((acc, curr) => (curr > acc ? curr : acc), 0);
  }
}
