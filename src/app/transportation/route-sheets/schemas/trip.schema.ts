import { isoDateToDate } from 'src/app/library';
import { z } from 'zod';
import { RouteTripStopSchema } from './trip-stop.schema';

export const RouteTripSchema = z.object({
  date: isoDateToDate,
  tripLengthKm: z.number().nonnegative(),
  fuelConsumed: z.number().nonnegative(),
  odoStartKm: z.number().nonnegative(),
  odoStopKm: z.number().nonnegative(),
  description: z.string().max(255),
  stops: RouteTripStopSchema.array(),
});
export type RouteTrip = z.infer<typeof RouteTripSchema>;
