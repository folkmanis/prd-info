import { Expose } from 'class-transformer';
import { FuelTypeInterface } from 'src/app/interfaces/module-settings';

export class FuelType implements FuelTypeInterface {
  @Expose()
  type: string;

  @Expose()
  description: string;

  @Expose()
  units: string;
}
