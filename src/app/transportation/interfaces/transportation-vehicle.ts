import { Expose, Type } from 'class-transformer';
import { FuelType } from './fuel-type';

export class TransportationVehicle {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  licencePlate: string;

  @Expose()
  consuption: number; // units

  @Type(() => FuelType)
  @Expose()
  fuelType: FuelType;

  @Expose()
  disabled: boolean;
}
