import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { OdometerReading } from '../interfaces/transportation-vehicle';
import { RouteSheetService } from '../services/route-sheet.service';
import { TransportationVehicleService } from '../services/transportation-vehicle.service';
import { ConsumptionData, ConsumptionTableComponent } from './consumption-table/consumption-table.component';
import { DecimalPipe } from '@angular/common';
import { calculateMonthlyConsumption } from './calculate-monthly-consumption';

function getYears(odometerReadings: OdometerReading[]): string[] {
  const years = new Set<number>();
  for (const reading of odometerReadings) {
    years.add(reading.date.getFullYear());
  }
  return [...years].sort((a, b) => a - b).map(String);
}

@Component({
  selector: 'app-monthly-consumption',
  imports: [FormField, MatFormFieldModule, MatSelect, MatOption, MatCardModule, ConsumptionTableComponent, DecimalPipe],
  templateUrl: './monthly-consumption.component.html',
  styleUrl: './monthly-consumption.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyConsumptionComponent {
  #vehiclesService = inject(TransportationVehicleService);
  #routeSheetService = inject(RouteSheetService);

  protected vehicles = this.#vehiclesService.getVehiclesResource({ disabled: false });

  protected selectionModel = signal({
    vehicle: '',
    year: '',
  });
  protected selectionForm = form(this.selectionModel, (schema) => {
    required(schema.vehicle);
    required(schema.year);
    disabled(schema.year, ({ stateOf }) => stateOf(schema.vehicle).invalid());
  });

  protected vehicleResource = this.#vehiclesService.getVehicleResource(computed(() => this.selectionModel().vehicle));
  protected years = computed(() =>
    this.vehicleResource.hasValue() ? getYears(this.vehicleResource.value().odometerReadings) : [],
  );

  protected consumption = computed(() => this.#getConsumption());
  protected consumptionUnits = computed(() =>
    this.vehicleResource.hasValue() ? `${this.vehicleResource.value().fuelType.units}/100 km` : '',
  );

  protected routeSheetResource = resource({
    params: () => {
      if (this.selectionForm().valid()) {
        const { vehicle, year } = this.selectionModel();
        return {
          year: Number.parseInt(year),
          vehicleId: vehicle,
        };
      } else {
        return null;
      }
    },
    loader: async ({ params }) => {
      if (params !== null) {
        return this.#routeSheetService.getRouteSheets(params);
      } else {
        return null;
      }
    },
  });

  #getConsumption(): ConsumptionData[] | null {
    if (this.routeSheetResource.hasValue() === false || this.vehicleResource.hasValue() === false) {
      return null;
    }
    const year = Number.parseInt(this.selectionModel().year);
    if (isNaN(year)) {
      return null;
    }
    const routeSheets = this.routeSheetResource.value() ?? [];
    if (this.vehicleResource.hasValue()) {
      return calculateMonthlyConsumption(year, this.vehicleResource.value().odometerReadings, routeSheets);
    } else {
      return null;
    }
  }
}
