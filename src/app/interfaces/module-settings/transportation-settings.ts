import { z } from 'zod';
import { FuelType } from './fuel-type';
import { ShippingAddressSchema } from './shipping-address';

export const TransportationSettings = z.object({
  shippingAddress: ShippingAddressSchema.nullable(),
  fuelTypes: z.array(FuelType),
});
export type TransportationSettings = z.infer<typeof TransportationSettings>;
