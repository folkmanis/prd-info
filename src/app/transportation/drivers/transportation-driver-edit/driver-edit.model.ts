import { nullableString, pickNotNull } from 'src/app/library';
import { z } from 'zod';
import { Driver, DriverCreate, DriverUpdate } from '../schemas/transportation-driver';

export const DriverModelSchema = z.object({
  name: z.string(),
  disabled: z.boolean(),
  description: nullableString,
});
export type DriverModel = z.infer<typeof DriverModelSchema>;

export function driverToModel(driver: Driver): DriverModel {
  const model = DriverModelSchema.decode(driver);
  return model;
}

export function modelToDriverCreate(model: DriverModel): DriverCreate {
  return pickNotNull(DriverModelSchema.encode(model));
}

export function modelToDriverUpdate(model: Partial<DriverModel>): DriverUpdate {
  return DriverModelSchema.partial().encode(model);
}
