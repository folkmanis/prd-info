import { Expose } from 'class-transformer';

export class HistoricalData {
  @Expose()
  lastMonth: number;

  @Expose()
  lastYear: number;

  @Expose()
  fuelRemaining: number;

  @Expose()
  lastOdometer: number;
}
