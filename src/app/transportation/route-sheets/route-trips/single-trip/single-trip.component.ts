import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  applyEach,
  disabled,
  form,
  FormField,
  FormRoot,
  maxLength,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { endOfMonth, startOfMonth } from 'date-fns';
import { round } from 'lodash-es';
import { ExpressionInputDirective } from 'prd-cdk';
import { Observable } from 'rxjs';
import { computedChanges } from 'src/app/library/signals';
import { updateCatching } from 'src/app/library/update-catching';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { TransportationCustomer } from 'src/app/transportation/route-sheets/schemas/transportation-customer';
import { RouteTrip, RouteTripStop } from '../../schemas';
import { RouteSheetService } from '../../services/route-sheet.service';
import { fromModel, toModel } from './route-trip-model.schema';
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
  tripLengthCalculator: (stops: RouteTripStop[]) => Promise<number>;
}

@Component({
  selector: 'app-single-trip',
  imports: [
    FormField,
    FormRoot,
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
    MatAnchor,
  ],
  templateUrl: './single-trip.component.html',
  styleUrl: './single-trip.component.scss',
})
export class SingleTripComponent {
  #routeService = inject(RouteSheetService);
  #data = inject<TripDialogData>(MAT_DIALOG_DATA);
  #dialogRef = inject(MatDialogRef);
  protected busy = signal(false);
  #update = updateCatching(this.busy);

  protected lastOdometer$ = this.#data.lastOdometer$;
  protected fuelUnits = this.#data.fuelUnits;
  protected descriptions$ = this.#data.descriptions$;
  protected customers$ = this.#data.customers$;

  protected startDate = startOfMonth(new Date(this.#data.year, this.#data.month - 1));
  protected endDate = endOfMonth(new Date(this.#data.year, this.#data.month - 1));

  #initialModel = toModel(this.#data.trip);
  #tripModel = signal(this.#initialModel);
  protected tripForm = form(
    this.#tripModel,
    (s) => {
      disabled(s, { when: () => this.busy() });

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
        const odoStartKm = valueOf(s.odoStartKm);
        const tripLengthKm = valueOf(s.tripLengthKm);
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
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (schema) => {
          this.#dialogRef.close(fromModel(schema().value()));
        },
      },
    },
  );

  protected changes = computed(() => computedChanges(this.#tripModel(), this.#initialModel));

  protected consumptionRate = computed(
    () => ((+this.#tripModel().fuelConsumed || 0) / (+this.#tripModel().tripLengthKm || 1)) * 100,
  );

  protected async calculateRoute() {
    if (this.tripForm.stops().valid() === false) {
      return;
    }

    this.busy.set(true);

    const { stops, odoStartKm } = this.#tripModel();

    this.#update(
      async (message) => {
        const tripLengthKm = await this.#routeService.getTripLength(stops);
        message(`Aprēķināts veiktais ceļš ${tripLengthKm} km`);
        const odoStopKm = odoStartKm + tripLengthKm;
        const { fuelConsumption } = this.#data;
        const fuelConsumed = round((fuelConsumption * tripLengthKm) / 100, 1);
        this.#tripModel.update((trip) => ({
          ...trip,
          tripLengthKm: tripLengthKm,
          odoStopKm: odoStopKm,
          fuelConsumed,
        }));
      },
      (message, err) => {
        message(`Kļūda: ${err.message}`);
      },
    );
  }
}
