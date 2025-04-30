import { z } from 'zod';
import { ShippingAddress } from './module-settings/shipping-address';

export const CustomerFinancial = z.object({
  clientName: z.string(),
  paytraqId: z.number().optional(),
});

export const FtpUserData = z.object({
  folder: z.string(),
  username: z.string().catch(''),
  password: z.string().catch(''),
});

export const CustomerContact = z.object({
  email: z.string().email(),
});

export const Customer = z.object({
  _id: z.string(),
  code: z.string().min(2).max(3).toUpperCase(),
  CustomerName: z.string(),
  disabled: z.boolean().default(false),
  insertedFromXmf: z.coerce.date().nullish().default(null),
  description: z.string().nullish(),
  financial: CustomerFinancial.nullable().catch(null),
  ftpUser: z.boolean().default(false),
  ftpUserData: FtpUserData.nullable().catch(null),
  contacts: z.array(CustomerContact).default([]),
  shippingAddress: ShippingAddress.nullish().default(null),
});

export const CustomerPartial = Customer.pick({
  _id: true,
  CustomerName: true,
  code: true,
  disabled: true,
});

export const NewCustomer = Customer.pick({
  CustomerName: true,
  disabled: true,
  code: true,
  description: true,
  ftpUser: true,
  contacts: true,
});

export const CustomerUpdate = Customer.omit({
  _id: true,
}).partial();

export type CustomerPartial = z.infer<typeof CustomerPartial>;
export type NewCustomer = z.infer<typeof NewCustomer>;
export type CustomerUpdate = z.infer<typeof CustomerUpdate>;
export type CustomerFinancial = z.infer<typeof CustomerFinancial>;
export type FtpUserData = z.infer<typeof FtpUserData>;
export type CustomerContact = z.infer<typeof CustomerContact>;
export type Customer = z.infer<typeof Customer>;

export function newCustomerContact(email: string): CustomerContact {
  return { email };
}

export function newCustomer(): NewCustomer {
  return {
    CustomerName: '',
    code: '',
    disabled: false,
    description: '',
    ftpUser: false,
    contacts: [],
  };
}
