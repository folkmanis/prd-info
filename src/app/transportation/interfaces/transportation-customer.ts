import { Customer } from 'src/app/interfaces';
import { z } from 'zod';

export const TransportationCustomer = Customer.pick({
  _id: true,
  CustomerName: true,
  shippingAddress: true,
});
export type TransportationCustomer = z.infer<typeof TransportationCustomer>;
