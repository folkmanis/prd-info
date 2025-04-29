import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
import { MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { round } from 'lodash-es';
import { ExpressionInputDirective } from 'prd-cdk';
import { filter } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteTrip, RouteStop, newRouteTrip } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { TripStopsComponent } from './trip-stops/trip-stops.component';

@Component({
  selector: 'app-single-trip',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconButton,
    MatIcon,
    MatInput,
    MatDatepickerModule,
    ViewSizeDirective,
    TripStopsComponent,
    DecimalPipe,
    TextFieldModule,
    AsyncPipe,
    MatMenuModule,
    MatTooltip,
    ExpressionInputDirective,
  ],
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
      stops: [[] as RouteStop[]],
      description: [null as string | null, [Validators.required, Validators.maxLength(255)]],
    },
    { validators: [this.validateOdoStop()] },
  );

  customers = input<TransportationCustomer[] | null>([]);

  fuelConsumption = input<number | null>(null);

  fuelUnits = input<string | null>(null);

  lastOdometer = input<number | null>(null);

  startDate = input<Date | null>();

  descriptions$ = this.routeService.descriptions();

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
    const trip = obj ?? newRouteTrip();
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
    const stops = this.form.controls.stops.value;
    if (this.form.controls.stops.valid === false || !stops || stops.length === 0) {
      return;
    }
    this.form.disable({ emitEvent: false });
    try {
      const tripLengthKm = await this.routeService.getTripLength(stops);
      const odoStopKm = (this.form.value.odoStartKm || 0) + tripLengthKm;
      const fuelConsumptionValue = this.fuelConsumption();
      const fuelConsumed = fuelConsumptionValue !== null ? round((fuelConsumptionValue * tripLengthKm) / 100, 1) : null;
      this.form.patchValue(
        {
          tripLengthKm,
          odoStopKm,
          fuelConsumed,
        },
        { emitEvent: false },
      );
    } catch (error) {
      this.messageService.confirmDataError(error.message);
    } finally {
      this.form.enable();
    }
  }

  onSetDescription(value: string) {
    this.form.controls.description.setValue(value);
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
