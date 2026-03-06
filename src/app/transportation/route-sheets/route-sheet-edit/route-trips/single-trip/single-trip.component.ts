import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  applyEach,
  disabled,
  form,
  FormField,
  maxLength,
  min,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { endOfMonth, startOfMonth } from 'date-fns';
import { round } from 'lodash-es';
import { ExpressionInputDirective } from 'prd-cdk';
import { Observable } from 'rxjs';
import { computedChanges } from 'src/app/library/signals';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteStop, RouteTrip } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { TripStopsComponent } from './trip-stops/trip-stops.component';

export interface TripDialogData {
  trip: RouteTrip;
  month: number;
  year: number;
  fuelConsumption: number;
  fuelUnits: string;
  descriptions$: Observable<string[]>;
  lastOdometer$: Observable<number | null>;
  customers$: Observable<TransportationCustomer[]>;
  tripLengthCalculator: (stops: RouteStop[]) => Promise<number>;
}

interface TripModel {
  date: Date;
  tripLengthKm: string;
  fuelConsumed: number;
  odoStartKm: string;
  odoStopKm: string;
  description: string;
  stops: {
    customerId: string;
    name: string;
    address: string;
    googleLocationId: string;
  }[];
}

@Component({
  selector: 'app-single-trip',
  imports: [
    MatFormFieldModule,
    MatIconButton,
    MatIcon,
    MatInput,
    MatButton,
    MatDatepickerModule,
    ViewSizeDirective,
    TripStopsComponent,
    DecimalPipe,
    TextFieldModule,
    AsyncPipe,
    MatMenuModule,
    MatTooltip,
    ExpressionInputDirective,
    MatDialogModule,
    FormField,
    MatAnchor,
  ],
  templateUrl: './single-trip.component.html',
  styleUrl: './single-trip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleTripComponent {
  #routeService = inject(RouteSheetService);
  #data = inject<TripDialogData>(MAT_DIALOG_DATA);
  #dialogRef = inject(MatDialogRef);
  #snack = inject(MatSnackBar);

  protected busy = signal(false);

  protected lastOdometer$ = this.#data.lastOdometer$;
  protected fuelUnits = this.#data.fuelUnits;
  protected descriptions$ = this.#data.descriptions$;
  protected customers$ = this.#data.customers$;

  protected startDate = startOfMonth(new Date(this.#data.year, this.#data.month - 1));
  protected endDate = endOfMonth(new Date(this.#data.year, this.#data.month - 1));

  #initialModel = this.#toModel(this.#data.trip);
  #tripModel = signal(this.#initialModel);
  protected tripForm = form(this.#tripModel, (s) => {
    disabled(s, () => this.busy());

    required(s.date);
    validate(s.date, ({ value }) =>
      value() >= this.startDate && value() <= this.endDate
        ? null
        : { kind: 'invalid_date', message: `Jābūt atskaites mēnesī` },
    );

    required(s.tripLengthKm);
    min(s.tripLengthKm, 0);

    required(s.fuelConsumed);
    min(s.fuelConsumed, 0);

    required(s.odoStartKm);
    min(s.odoStartKm, 0);

    required(s.odoStopKm);
    validate(s.odoStopKm, ({ value, valueOf }) => {
      const odoStartKm = Number(valueOf(s.odoStartKm));
      const tripLengthKm = Number(valueOf(s.tripLengthKm));
      return Number(value()) < odoStartKm + tripLengthKm
        ? {
            kind: 'invalid_odo',
            message: `Min. ${odoStartKm + tripLengthKm} km`,
          }
        : null;
    });

    applyEach(s.stops, (stopS) => {
      required(stopS.name);
      required(stopS.address);
    });

    required(s.description);
    maxLength(s.description, 255);
  });

  protected changes = computed(() => computedChanges(this.#tripModel() as Record<string, any>, this.#initialModel));

  protected consumptionRate = computed(
    () => ((+this.#tripModel().fuelConsumed || 0) / (+this.#tripModel().tripLengthKm || 1)) * 100,
  );

  protected async saveTrip() {
    submit(this.tripForm, async (s) => {
      if (s().valid() === false) {
        return;
      }
      this.#dialogRef.close(this.#fromModel(s().value()));
    });
  }

  #toModel(trip: RouteTrip): TripModel {
    return {
      ...trip,
      odoStartKm: trip.odoStartKm.toString(),
      odoStopKm: trip.odoStopKm.toString(),
      tripLengthKm: trip.tripLengthKm.toString(),
      stops: trip.stops.map((s) => ({
        ...s,
        customerId: s.customerId ?? '',
        googleLocationId: s.googleLocationId ?? '',
      })),
    };
  }

  #fromModel(model: TripModel): RouteTrip {
    return {
      ...model,
      tripLengthKm: Number(model.tripLengthKm),
      odoStartKm: Number(model.odoStartKm),
      odoStopKm: Number(model.odoStopKm),
      stops: model.stops.map((s) => ({
        ...s,
        customerId: s.customerId || null,
        googleLocationId: s.googleLocationId || null,
      })),
    };
  }

  protected async calculateRoute() {
    if (this.tripForm.stops().valid() === false) {
      return;
    }

    this.busy.set(true);

    const { stops, odoStartKm } = this.#tripModel();

    try {
      const tripLengthKm = await this.#routeService.getTripLength(stops);
      const odoStopKm = Number(odoStartKm) + tripLengthKm;
      const { fuelConsumption } = this.#data;
      const fuelConsumed = round((fuelConsumption * tripLengthKm) / 100, 1);
      this.#tripModel.update((trip) => ({
        ...trip,
        tripLengthKm: tripLengthKm.toString(),
        odoStopKm: odoStopKm.toString(),
        fuelConsumed,
      }));
    } catch (error) {
      this.#snack.open(`Neizdevās aprēķināt ceļu: ${error.message}`, 'OK');
    } finally {
      this.busy.set(false);
    }
  }
}
