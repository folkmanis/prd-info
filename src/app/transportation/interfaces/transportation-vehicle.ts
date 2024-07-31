import { Expose, Type } from 'class-transformer';
import { FuelType } from './fuel-type';

export class TransportationVehicle {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  name: string;

  @Expose()
  licencePlate: string;

  @Expose()
  consuption: number; // units

  @Type(() => FuelType)
  @Expose()
  fuelType: FuelType = new FuelType();

  @Expose()
  disabled = false;
}
