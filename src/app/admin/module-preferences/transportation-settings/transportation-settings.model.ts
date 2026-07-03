import { applyEach, required, SchemaPathTree } from '@angular/forms/signals';
import { FuelTypeSchema, ShippingAddressModelSchema, validateShippingAddress } from 'src/app/interfaces';
import { z } from 'zod';

export const FuelTypeModelSchema = FuelTypeSchema.prefault({
  type: '',
  description: '',
  units: '',
});
export type FuelTypeModel = z.infer<typeof FuelTypeModelSchema>;

export const TransportationSettingsModelSchema = z.object({
  shippingAddress: ShippingAddressModelSchema,
  fuelTypes: z.array(FuelTypeModelSchema),
});
export type TransportationSettingsModel = z.infer<typeof TransportationSettingsModelSchema>;

export function validateTransportationSettingsModel(path: SchemaPathTree<TransportationSettingsModel>) {
  applyEach(path.fuelTypes, (s) => {
    validateFuelType(s);
  });

  validateShippingAddress(path.shippingAddress);
}

export function validateFuelType(path: SchemaPathTree<FuelTypeModel>) {
  required(path.description);
  required(path.type);
  required(path.units);
}
