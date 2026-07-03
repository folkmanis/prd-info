import { z } from 'zod';
import { FuelTypeSchema } from './fuel-type';
import { ShippingAddressSchema } from './shipping-address';

export const TransportationSettingsSchema = z.object({
  shippingAddress: ShippingAddressSchema.nullable(),
  fuelTypes: z.array(FuelTypeSchema),
});
export type TransportationSettings = z.infer<typeof TransportationSettingsSchema>;
