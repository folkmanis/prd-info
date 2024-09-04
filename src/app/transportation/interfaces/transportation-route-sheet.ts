import { Expose, Type } from 'class-transformer';
import { TransportationVehicle } from './transportation-vehicle';
import { TransportationDriver } from './transportation-driver';
import { FuelType } from './fuel-type';

export class TransportationRouteSheet {
  @Expose()
  _id: string;

  @Expose()
  year: number;

  @Expose()
  month: number;

  @Expose()
  fuelRemainingStartLitres: number;

  @Expose()
  driver: TransportationDriver;

  @Expose()
  @Type(() => TransportationVehicle)
  vehicle: TransportationVehicle;

  @Expose()
  @Type(() => RouteTrip)
  trips: RouteTrip[] = [];

  @Expose()
  @Type(() => FuelPurchase)
  fuelPurchases: FuelPurchase[] = [];
}

export class RouteTrip {
  @Expose()
  @Type(() => Date)
  date: Date;

  @Expose()
  tripLengthKm: number;

  @Expose()
  fuelConsumedLitres: number;

  @Expose()
  odoStartKm: number;

  @Expose()
  odoStopKm: number;

  @Expose()
  @Type(() => RouteTripStop)
  stops: RouteTripStop[] = [];
}

export class RouteTripStop {
  @Expose()
  customerId?: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  googleLocationId?: string;
}

export class FuelPurchase {
  @Expose()
  @Type(() => Date)
  date: Date = new Date();

  @Expose()
  type: string;

  @Expose()
  units: string;

  @Expose()
  amount: number = null;

  @Expose()
  price: number = null;

  @Expose()
  total: number;

  @Expose()
  invoiceId?: string;

  constructor(fuelType?: FuelType) {
    if (fuelType) {
      this.type = fuelType.type;
      this.units = fuelType.units;
    }
  }
}
