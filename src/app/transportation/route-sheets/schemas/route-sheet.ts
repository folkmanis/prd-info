import { optionalToNullable } from 'src/app/library';
import { z } from 'zod';
import { RouteSheetDriverSchema } from '../../drivers';
import { RouteSheetVehicleSchema } from '../../vehicles';
import { FuelPurchaseSchema } from './fuel-purchase.schema';
import { RouteTripSchema } from './trip.schema';

export const RouteSheetSchema = z.object({
  _id: z.string(),
  year: z.number().min(1990),
  month: z.number().min(1).max(12),
  fuelRemainingStartLitres: z.number(),
  driver: RouteSheetDriverSchema,
  vehicle: RouteSheetVehicleSchema,
  description: z.string().optional(),
  trips: RouteTripSchema.array(),
  fuelPurchases: FuelPurchaseSchema.array(),
});
export type RouteSheet = z.infer<typeof RouteSheetSchema>;

export const RouteSheetListSchema = z.object({
  year: RouteSheetSchema.shape.year,
  month: RouteSheetSchema.shape.month,
  _id: RouteSheetSchema.shape._id,
  driver: RouteSheetSchema.shape.driver.pick({ name: true, _id: true }),
  vehicle: RouteSheetSchema.shape.vehicle.pick({ _id: true, name: true, licencePlate: true }),
});
export type RouteSheetList = z.infer<typeof RouteSheetListSchema>;

export const RouteSheetCrateSchema = RouteSheetSchema.omit({
  _id: true,
});
export type RouteSheetCreate = z.infer<typeof RouteSheetCrateSchema>;

export const RouteSheetUpdateSchema = optionalToNullable(RouteSheetSchema)
  .omit({
    _id: true,
  })
  .partial();
export type RouteSheetUpdate = z.infer<typeof RouteSheetUpdateSchema>;
