import { isoDatetimeToDate, optionalToNullable } from 'src/app/library';
import { z } from 'zod';

const FuelTypeSchema = z.object({
  type: z.string().nonempty(),
  units: z.string().nonempty(),
  description: z.string(),
});

export const OdometerReadingSchema = z.object({
  value: z.number().nonnegative(),
  date: isoDatetimeToDate,
});
export type OdometerReading = z.infer<typeof OdometerReadingSchema>;

export const VehicleSchema = z.object({
  _id: z.string(),
  name: z.string().nonempty(),
  disabled: z.boolean(),
  licencePlate: z.string().toUpperCase(),
  passportNumber: z.string().toUpperCase().nonempty().optional(),
  vin: z.string().toUpperCase().nonempty().optional(),
  consumption: z.number().positive(), // units
  fuelType: FuelTypeSchema,
  odometerReadings: OdometerReadingSchema.array(),
  description: z.string().optional(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleListSchema = VehicleSchema.pick({
  _id: true,
  name: true,
  disabled: true,
  licencePlate: true,
  fuelType: true,
  consumption: true,
});
export type VehicleList = z.infer<typeof VehicleListSchema>;

export const VehicleUpdateSchema = optionalToNullable(VehicleSchema)
  .omit({
    _id: true,
  })
  .partial();
export type VehicleUpdate = z.infer<typeof VehicleUpdateSchema>;

export const VehicleCreateSchema = VehicleSchema.omit({
  _id: true,
});
export type VehicleCreate = z.infer<typeof VehicleCreateSchema>;

export const RouteSheetVehicleSchema = VehicleSchema.pick({
  _id: true,
  name: true,
  consumption: true,
  fuelType: true,
  licencePlate: true,
});
export type RouteSheetVehicle = z.infer<typeof RouteSheetVehicleSchema>;
