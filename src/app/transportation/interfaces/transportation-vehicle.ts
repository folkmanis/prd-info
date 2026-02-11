import { FuelType } from 'src/app/interfaces';
import { z } from 'zod';

export const OdometerReading = z.object({
  value: z.number().positive(),
  date: z.coerce.date(),
});
export type OdometerReading = z.infer<typeof OdometerReading>;

export const TransportationVehicle = z.object({
  _id: z.string(),
  name: z.string(),
  licencePlate: z.string(),
  passportNumber: z.string().nullish(),
  consumption: z.number(), // units
  fuelType: FuelType,
  disabled: z.boolean().default(false),
  vin: z.string().nullish(),
  odometerReadings: z.array(OdometerReading).default([]),
});
export type TransportationVehicle = z.infer<typeof TransportationVehicle>;

export const TransportationVehicleUpdate = TransportationVehicle.omit({
  _id: true,
}).partial();
export type TransportationVehicleUpdate = z.infer<typeof TransportationVehicleUpdate>;

export const TransportationVehicleCreate = TransportationVehicle.omit({
  _id: true,
});
export type TransportationVehicleCreate = z.infer<typeof TransportationVehicleCreate>;
