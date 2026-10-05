import { z } from 'zod';
import { Vehicle, VehicleCreate, VehicleUpdate } from '../schemas/transportation-vehicle';
import { nullableString, pickNotNull } from 'src/app/library';

export const FuelTypeEditSchema = z.object({
  type: z.string(),
  units: z.string(),
  description: z.string(),
});

const OdometerReadingEditSchema = z.object({
  value: z.number().nonnegative(),
  date: z.date(),
});

export const VehicleEditSchema = z.object({
  name: z.string(),
  disabled: z.boolean(),
  licencePlate: z.string(),
  passportNumber: nullableString,
  vin: nullableString,
  consumption: z.number(), // units
  fuelType: FuelTypeEditSchema,
  odometerReadings: OdometerReadingEditSchema.array(),
  description: nullableString,
});
export type VehicleEdit = z.infer<typeof VehicleEditSchema>;

export function vehicleToModel(vehicle: Vehicle): VehicleEdit {
  const model = VehicleEditSchema.decode(vehicle);
  return model;
}

export function modelToVehicleCreate(model: VehicleEdit): VehicleCreate {
  const create = VehicleEditSchema.encode(model);
  return pickNotNull(create);
}

export function modelToVehicleUpdate(model: Partial<VehicleEdit>): VehicleUpdate {
  const update = VehicleEditSchema.partial().encode(model);
  return update;
}
