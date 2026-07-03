import { FuelTypeSchema } from 'src/app/interfaces';
import { z } from 'zod';

export const OdometerReadingSchema = z.object({
  value: z.number().positive(),
  date: z.coerce.date(),
});
export type OdometerReading = z.infer<typeof OdometerReadingSchema>;

export const TransportationVehicleSchema = z.object({
  _id: z.string(),
  name: z.string(),
  licencePlate: z.string(),
  passportNumber: z.string().nullish(),
  consumption: z.number(), // units
  fuelType: FuelTypeSchema,
  disabled: z.boolean().default(false),
  vin: z.string().nullish(),
  odometerReadings: z.array(OdometerReadingSchema).default([]),
});
export type TransportationVehicle = z.infer<typeof TransportationVehicleSchema>;

export const TransportationVehicleUpdate = TransportationVehicleSchema.omit({
  _id: true,
}).partial();
export type TransportationVehicleUpdate = z.infer<typeof TransportationVehicleUpdate>;

export const TransportationVehicleCreate = TransportationVehicleSchema.omit({
  _id: true,
});
export type TransportationVehicleCreate = z.infer<typeof TransportationVehicleCreate>;
