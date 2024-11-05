import { Expose, Transform } from 'class-transformer';
import { round } from 'lodash-es';

export class HistoricalData {
  @Expose()
  lastMonth: number;

  @Expose()
  lastYear: number;

  @Expose()
  @Transform(({ value }) => round(value, 2))
  fuelRemaining: number;

  @Expose()
  lastOdometer: number;
}
