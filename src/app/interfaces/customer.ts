import { z } from 'zod';
import { shippingAddressSchema } from './module-settings/shipping-address';

export const customerFinancialSchema = z.object({
  clientName: z.string(),
  paytraqId: z.number().optional(),
});

export const ftpUserDataSchema = z.object({
  folder: z.string(),
  username: z.string().catch(''),
  password: z.string().catch(''),
});

export const customerContactSchema = z.object({
  email: z.string().email(),
});

export const customerSchema = z.object({
  _id: z.string(),
  code: z.string().min(2).max(3).toUpperCase(),
  CustomerName: z.string(),
  disabled: z.boolean().default(false),
  insertedFromXmf: z.coerce.date().nullish().default(null),
  description: z.string().nullish(),
  financial: customerFinancialSchema.nullable().catch(null),
  ftpUser: z.boolean().default(false),
  ftpUserData: ftpUserDataSchema.nullable().catch(null),
  contacts: z.array(customerContactSchema).default([]),
  shippingAddress: shippingAddressSchema.nullish().default(null),
});

export const customerPartialSchema = customerSchema.pick({
  _id: true,
  CustomerName: true,
  code: true,
  disabled: true,
});

export const newCustomerSchema = customerSchema.pick({
  CustomerName: true,
  disabled: true,
  code: true,
  description: true,
  ftpUser: true,
  contacts: true,
});

export const customerUpdateSchema = customerSchema
  .omit({
    _id: true,
  })
  .partial();

export type CustomerPartial = z.infer<typeof customerPartialSchema>;
export type NewCustomer = z.infer<typeof newCustomerSchema>;
export type CustomerUpdate = z.infer<typeof customerUpdateSchema>;
export type CustomerFinancial = z.infer<typeof customerFinancialSchema>;
export type FtpUserData = z.infer<typeof ftpUserDataSchema>;
export type CustomerContact = z.infer<typeof customerContactSchema>;
export type Customer = z.infer<typeof customerSchema>;

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
