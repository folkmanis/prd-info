import { CustomerSchema } from 'src/app/interfaces';
import { z } from 'zod';

export const TransportationCustomer = CustomerSchema.pick({
  _id: true,
  customerName: true,
  shippingAddress: true,
});
export type TransportationCustomer = z.infer<typeof TransportationCustomer>;
