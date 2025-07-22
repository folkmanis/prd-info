import { z } from 'zod';
import { FuelType } from './fuel-type';
import { ShippingAddress } from './shipping-address';

export const TransportationSettings = z.object({
  shippingAddress: ShippingAddress.nullable(),
  fuelTypes: z.array(FuelType),
});
export type TransportationSettings = z.infer<typeof TransportationSettings>;
