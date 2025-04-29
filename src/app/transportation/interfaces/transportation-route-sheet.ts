import { z } from 'zod';
import { newTransportationDriver, transportationDriverSchema } from './transportation-driver';
import { newTransportationVehicle, transportationVehicleSchema } from './transportation-vehicle';
import { fuelPurchaseSchema } from './fuel-purchase';

export const RouteStop = z.object({
  customerId: z.string().nullish(),
  name: z.string(),
  address: z.string(),
  googleLocationId: z.string().nullish(),
});
export type RouteStop = z.infer<typeof RouteStop>;

export const RouteTrip = z.object({
  date: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  tripLengthKm: z.number(),
  fuelConsumed: z.number(),
  odoStartKm: z.number(),
  odoStopKm: z.number(),
  description: z.string(),
  stops: z.array(RouteStop),
});
export type RouteTrip = z.infer<typeof RouteTrip>;

export function newRouteTrip(): RouteTrip {
  return {
    date: new Date(),
    tripLengthKm: 0,
    fuelConsumed: 0,
    odoStartKm: 0,
    odoStopKm: 0,
    description: '',
    stops: [],
  };
}

export const TransportationRouteSheet = z.object({
  _id: z.string(),
  year: z.number(),
  month: z.number(),
  fuelRemainingStartLitres: z.number(),
  driver: transportationDriverSchema,
  vehicle: transportationVehicleSchema,
  trips: z.array(RouteTrip),
  fuelPurchases: z.array(fuelPurchaseSchema),
});
export type TransportationRouteSheet = z.infer<typeof TransportationRouteSheet>;

export function newTransportationRouteSheet(): TransportationRouteSheet {
  return {
    _id: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    fuelRemainingStartLitres: 0,
    driver: newTransportationDriver(),
    vehicle: newTransportationVehicle(),
    trips: [],
    fuelPurchases: [],
  };
}

export const transportationRouteSheetSchemaCrate = TransportationRouteSheet.omit({
  _id: true,
});
export type TransportationRouteSheetCreate = z.infer<typeof transportationRouteSheetSchemaCrate>;

export const transportationRouteSheetSchemaUpdate = TransportationRouteSheet.omit({
  _id: true,
}).partial();
export type TransportationRouteSheetUpdate = z.infer<typeof transportationRouteSheetSchemaUpdate>;
