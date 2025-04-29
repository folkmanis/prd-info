import { customerSchema } from 'src/app/interfaces';
import { z } from 'zod';

export const transportationCustomerSchema = customerSchema.pick({
  _id: true,
  CustomerName: true,
  shippingAddress: true,
});
export type TransportationCustomer = z.infer<typeof transportationCustomerSchema>;
