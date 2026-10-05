import { z } from 'zod';
import { RouteTrip } from '../../schemas';
import { TripStopModelSchema } from './trip-stops/trip-stop-dialog/trip-stop-model.schema';

const RouteTripModelSchema = z.object({
  date: z.date(),
  tripLengthKm: z.number(),
  fuelConsumed: z.number(),
  odoStartKm: z.number(),
  odoStopKm: z.number(),
  description: z.string(),
  stops: TripStopModelSchema.array(),
});
export type RouteTripModel = z.infer<typeof RouteTripModelSchema>;

export function toModel(trip: RouteTrip): RouteTripModel {
  return RouteTripModelSchema.decode(trip);
}

export function fromModel(model: RouteTripModel): RouteTrip {
  return RouteTripModelSchema.encode(model);
}
