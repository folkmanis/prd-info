import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { disabled, form, FormField, required } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { OdometerReading } from '../vehicles/schemas/transportation-vehicle';
import { TransportationVehicleService } from '../vehicles/services/transportation-vehicle.service';
import { ConsumptionTableComponent } from './consumption-table/consumption-table.component';
import { MonthlyConsumptionService } from './monthly-consumption.service';

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
})
export class MonthlyConsumptionComponent {
  #consumptionService = inject(MonthlyConsumptionService);
  #vehiclesService = inject(TransportationVehicleService);

  protected vehicles = this.#vehiclesService.getVehiclesResource({ disabled: false });

  protected selectionModel = signal({
    vehicle: '',
    year: '',
  });
  protected selectionForm = form(this.selectionModel, (schema) => {
    required(schema.vehicle);
    required(schema.year);
    disabled(schema.year, { when: ({ stateOf }) => stateOf(schema.vehicle).invalid() });
  });

  protected vehicleResource = resource({
    params: () => {
      if (this.selectionForm.vehicle().valid()) {
        return this.selectionForm.vehicle().value();
      }
    },
    loader: ({ params }) => this.#vehiclesService.getVehicle(params),
  });
  protected years = computed(() =>
    this.vehicleResource.hasValue() ? getYears(this.vehicleResource.value().odometerReadings) : [],
  );

  protected consumptionData = resource({
    params: () => {
      if (this.routeSheetResource.hasValue() === false || this.vehicleResource.hasValue() === false) {
        return;
      }
      const year = Number.parseInt(this.selectionModel().year);
      if (isNaN(year)) {
        return;
      }
      return {
        year,
        odometerReadings: this.vehicleResource.value().odometerReadings,
        rsIds: this.routeSheetResource.value(),
      };
    },
    loader: ({ params }) =>
      this.#consumptionService.calculateMonthlyConsumption(params.year, params.odometerReadings, params.rsIds),
  });
  protected consumptionUnits = computed(() =>
    this.vehicleResource.hasValue() ? `${this.vehicleResource.value().fuelType.units}/100 km` : '',
  );

  protected routeSheetResource = resource({
    params: () => {
      if (this.selectionForm().valid()) {
        const { vehicle, year } = this.selectionForm().value();
        return {
          year: Number.parseInt(year),
          vehicleId: vehicle,
        };
      }
    },
    loader: async ({ params }) => this.#consumptionService.getRouteSheetList(params),
  });
}
