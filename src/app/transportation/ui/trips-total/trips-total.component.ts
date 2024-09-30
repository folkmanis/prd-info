import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { isObject } from 'lodash-es';
import { RouteTrip } from 'src/app/transportation/interfaces/transportation-route-sheet';

@Component({
  selector: 'app-trips-total',
  standalone: true,
  imports: [MatChipsModule, DecimalPipe],
  templateUrl: './trips-total.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripsTotalComponent {
  private validTrips = computed(() => this.routeTrips().filter(isObject));

  fuelUnits = input('');
  routeTrips = input.required<RouteTrip[]>();

  daysCount = computed(() => new Set(this.validTrips().map((t) => t.date?.getDate())).size);

  totalKm = computed(() => this.validTrips().reduce((acc, curr) => acc + curr?.tripLengthKm, 0));

  totalFuel = computed(() => this.validTrips().reduce((acc, curr) => acc + curr?.fuelConsumed, 0));
}
