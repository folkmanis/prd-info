import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { addBusinessDays, clamp, endOfMonth } from 'date-fns';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { numberOrDefaultZero } from 'src/app/library';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { updateCatching } from 'src/app/library/update-catching';
import { HistoricalData } from 'src/app/transportation/interfaces/historical-data';
import {
  RouteStop,
  RouteTrip,
  TransportationRouteSheet,
} from 'src/app/transportation/interfaces/transportation-route-sheet';
import { RouteSheetService } from 'src/app/transportation/services/route-sheet.service';
import { TripsTotalComponent } from '../../../ui/trips-total/trips-total.component';
import { SingleTripComponent, TripDialogData } from './single-trip/single-trip.component';

@Component({
  selector: 'app-route-trips',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButton,
    MatMenuModule,
    MatIcon,
    MatIconButton,
    TripsTotalComponent,
    MatListModule,
    MatDivider,
    ConfirmationDirective,
  ],
  templateUrl: './route-trips.component.html',
  styleUrl: './route-trips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteTripsComponent {
  readonly #routeSheetService = inject(RouteSheetService);
  readonly #dialog = inject(MatDialog);

  routeSheet = input.required<TransportationRouteSheet>();
  protected trips = linkedSignal(() => this.routeSheet().trips);
  protected busy = signal(false);
  readonly #updateFn = updateCatching(this.busy);
  #descriptions$ = this.#routeSheetService.descriptions();

  protected sortByDate() {
    const trips = this.trips();
    const sorted = this.#sortTripsByDate(trips);
    if (isEqual(trips, sorted) === false) {
      this.trips.set(sorted);
      this.#saveRouteTrips();
    }
  }

  protected getDescription = (stops: RouteStop[]) =>
    stops
      .map((stop) => stop.name)
      .filter(Boolean)
      .join(' - ');

  protected async editTrip(idx: number) {
    const dialogRef = this.#dialog.open(SingleTripComponent, { data: this.#getTripDialogData(this.trips()[idx]) });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.trips.update((ts) => ts.map((t, i) => (i === idx ? result : t)));
      this.#saveRouteTrips();
    }
  }

  protected deleteTrip(idx: number) {}

  protected async appendTrip() {
    const trip = {
      date: this.#getNextTripDay(),
      tripLengthKm: 0,
      fuelConsumed: 0,
      odoStartKm: 0,
      odoStopKm: 0,
      description: '',
      stops: [],
    };

    const dialogRef = this.#dialog.open(SingleTripComponent, { data: this.#getTripDialogData(trip) });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.trips.update((ts) => [...ts, result]);
      this.#saveRouteTrips();
    }
  }

  #sortTripsByDate = (trips: RouteTrip[]) => [...trips].sort((a, b) => a.date.getTime() - b.date.getTime());

  async #saveRouteTrips() {
    const { _id: id } = this.routeSheet();
    const update = { trips: this.trips() };

    this.#updateFn(async (message) => {
      const { trips } = await this.#routeSheetService.updateRouteSheet(id, update);
      this.trips.set(trips);
      message(`Izmaiņas saglabātas`);
    });
  }

  #getTripDialogData(trip: RouteTrip): TripDialogData {
    const {
      month,
      year,
      vehicle: {
        consumption: fuelConsumption,
        fuelType: { units: fuelUnits },
        licencePlate,
      },
    } = this.routeSheet();

    const lastOdometer$ = this.#routeSheetService
      .getHistoricalData(licencePlate)
      .pipe(map((h) => h?.lastOdometer ?? null));

    const customers$ = this.#routeSheetService.getCustomers();

    return {
      tripLengthCalculator: (stops) => this.#routeSheetService.getTripLength(stops),
      trip,
      month,
      year,
      fuelConsumption,
      fuelUnits,
      descriptions$: this.#descriptions$,
      lastOdometer$,
      customers$,
    };
  }

  #lastOdometer(hData: HistoricalData, trips: RouteTrip[], idx: number) {
    if (!hData) {
      return null;
    }
    if (trips.length === 1 && trips[idx].date && new Date(hData.lastYear, hData.lastMonth - 1) < trips[idx].date) {
      return hData.lastOdometer;
    }
    if (trips[idx]?.date) {
      return this.#lastDistance(trips, trips[idx].date) ?? hData.lastOdometer ?? null;
    }
    return null;
  }

  #lastDistance(trips: RouteTrip[], date: Date): number {
    return trips
      .filter((d) => d && d.date < date && d.odoStopKm > 0)
      .map((d) => numberOrDefaultZero(d?.odoStopKm))
      .reduce((acc, curr) => (curr > acc ? curr : acc), 0);
  }

  #getNextTripDay(): Date {
    const { year, month } = this.routeSheet();
    let date = 1;
    for (const trip of this.trips()) {
      const d = trip.date.getDate();
      console.log(d);
      if (d > date) {
        date = d;
      }
    }
    return clamp(addBusinessDays(new Date(year, month - 1, date), 1), {
      start: new Date(year, month - 1),
      end: endOfMonth(new Date(year, month - 1)),
    });
  }
}
