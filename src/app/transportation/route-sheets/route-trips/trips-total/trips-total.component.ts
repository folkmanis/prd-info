import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { isObject } from 'lodash-es';
import { RouteTrip } from '../../schemas';

@Component({
  selector: 'app-trips-total',
  imports: [MatChipsModule, DecimalPipe],
  templateUrl: './trips-total.component.html',
})
export class TripsTotalComponent {
  private validTrips = computed(() => this.routeTrips().filter(isObject) as RouteTrip[]);

  fuelUnits = input('');
  routeTrips = input.required<(RouteTrip | null)[]>();

  daysCount = computed(() => new Set(this.validTrips().map((t) => t.date?.getDate())).size);

  totalKm = computed(() => this.validTrips().reduce((acc, curr) => acc + curr?.tripLengthKm, 0));

  totalFuel = computed(() => this.validTrips().reduce((acc, curr) => acc + curr?.fuelConsumed, 0));
}
