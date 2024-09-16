import { DecimalPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { filter } from 'rxjs';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { RouteTrip, RouteTripStop } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { TripStopsComponent } from './trip-stops/trip-stops.component';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { MatCardModule } from '@angular/material/card';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { ConfirmationDialogService } from 'src/app/library';
import { round } from 'lodash-es';

@Component({
  selector: 'app-single-trip',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInput, MatDatepickerModule, ViewSizeDirective, TripStopsComponent, DecimalPipe],
  templateUrl: './single-trip.component.html',
  styleUrl: './single-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SingleTripComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SingleTripComponent,
      multi: true,
    },
  ],
})
export class SingleTripComponent implements ControlValueAccessor, Validator {
  private routeService = inject(RouteSheetService);
  private messageService = inject(ConfirmationDialogService);
  form = inject(FormBuilder).group(
    {
      date: [null as Date | null, [Validators.required]],
      tripLengthKm: [null as number | null, [Validators.required, Validators.min(0)]],
      fuelConsumed: [null as number | null, [Validators.required, Validators.min(0)]],
      odoStartKm: [null as number | null, [Validators.required, Validators.min(0)]],
      odoStopKm: [null as number | null, [Validators.required]],
      stops: [[] as RouteTripStop[]],
    },
    { validators: [this.validateOdoStop()] },
  );

  customers = input<TransportationCustomer[]>([]);

  fuelConsumption = input<number | null>(null);

  fuelUnits = input<string | null>(null);

  onTouched = () => {};

  constructor() {
    this.form.events
      .pipe(
        filter((event) => event instanceof TouchedChangeEvent && event.touched),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.onTouched());
  }

  writeValue(obj: RouteTrip | null): void {
    const trip = obj ?? new RouteTrip();
    this.form.reset(trip, { emitEvent: false });
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
      return Object.entries(this.form.controls).reduce(
        (acc, [key, control]) => ({
          ...acc,
          ...(control.invalid ? { [key]: control.errors } : {}),
        }),
        {},
      );
    }
  }

  async onCalculateRoute() {
    if (this.form.controls.stops.valid === false) {
      return;
    }
    this.form.disable({ emitEvent: false });
    const stops = this.form.controls.stops.value;
    try {
      const tripLengthKm = await this.routeService.getTripLength(stops);
      const odoStopKm = (this.form.value.odoStartKm || 0) + tripLengthKm;
      const fuelConsumed = this.fuelConsumption() !== null ? round((this.fuelConsumption() * tripLengthKm) / 100, 1) : null;
      this.form.patchValue({
        tripLengthKm,
        odoStopKm,
        fuelConsumed,
      });
    } catch (error) {
      this.messageService.confirmDataError(error.message);
    } finally {
      this.form.enable({ emitEvent: false });
    }
  }

  private validateOdoStop(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { odoStartKm, odoStopKm, tripLengthKm } = control.value;
      if (odoStartKm && odoStopKm && odoStartKm + (tripLengthKm || 0) > odoStopKm) {
        this.form.controls.odoStopKm.setErrors({ odoStopKm: odoStartKm });
        return { odoStopKm: odoStartKm + (tripLengthKm || 0) };
      }
      return null;
    };
  }
}
