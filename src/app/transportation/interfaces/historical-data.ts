import { round } from 'lodash-es';
import { z } from 'zod';

export const HistoricalData = z.object({
  lastMonth: z.number(),
  lastYear: z.number(),
  fuelRemaining: z.number().transform((value) => round(value, 2)),
  lastOdometer: z.number(),
});
export type HistoricalData = z.infer<typeof HistoricalData>;
