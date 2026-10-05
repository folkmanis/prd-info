import { optionalString } from 'src/app/library';
import { z } from 'zod';
import { TransportationCustomer } from '../../../../schemas';

export const TripStopModelSchema = z.object({
  customerId: optionalString,
  name: z.string(),
  address: z.string(),
  googleLocationId: optionalString,
});
export type TripStopModel = z.infer<typeof TripStopModelSchema>;

export function customerToModel(customer: TransportationCustomer): TripStopModel {
  return {
    customerId: customer._id,
    name: customer.customerName,
    address: customer.shippingAddress?.address ?? '',
    googleLocationId: customer.shippingAddress?.googleId ?? '',
  };
}
