import { z } from 'zod';
import { RouteTripStopSchema } from './trip-stop.schema';

const RouteTripStopAddressSchema = RouteTripStopSchema.pick({
  address: true,
  googleLocationId: true,
});
export type RouteTripStopAddress = z.infer<typeof RouteTripStopAddressSchema>;

export const DistanceRequestSchema = z.object({
  tripStops: RouteTripStopAddressSchema.array().min(2).max(10),
});
export type DistanceRequest = z.infer<typeof DistanceRequestSchema>;

export const CalculatedDistanceSchema = z.object({
  distance: z.number(),
});
export type CalculatedDistance = z.infer<typeof CalculatedDistanceSchema>;
