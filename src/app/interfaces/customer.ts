import { z } from 'zod';
import { isoDatetimeToDate } from '../library/validator';
import { ShippingAddressSchema } from './module-settings/shipping-address';

export const CustomerFinancialSchema = z.object({
  clientName: z.string(),
  paytraqId: z.number(),
});

export const FtpUserDataSchema = z.object({
  folder: z.string(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const CustomerContactSchema = z.object({
  email: z.email(),
});
export const defaultCustomerContact = (email = ''): CustomerContact => ({ email });

export const CustomerSchema = z
  .object({
    _id: z.string(),
    code: z.string(),
    customerName: z.string(),
    disabled: z.boolean(),
    description: z.string().optional(),
    insertedFromXmf: isoDatetimeToDate.optional(),
    financial: CustomerFinancialSchema.optional(),
    ftpUserData: FtpUserDataSchema.optional(),
    contacts: z.array(CustomerContactSchema).optional(),
    shippingAddress: ShippingAddressSchema.optional(),
  })
  .meta({ id: 'CustomerSchema' });
export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerListSchema = CustomerSchema.pick({
  _id: true,
  customerName: true,
  code: true,
  disabled: true,
});
export type CustomerList = z.infer<typeof CustomerListSchema>;

export const UpdateCustomerDtoSchema = z
  .object({
    code: z.string().nullable(),
    disabled: z.boolean(),
    description: z.string().nullable(),
    financial: CustomerFinancialSchema.nullable(),
    ftpUserData: FtpUserDataSchema.nullable(),
    contacts: z.array(CustomerContactSchema).nullable(),
    shippingAddress: ShippingAddressSchema.nullable(),
  })
  .partial();
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerDtoSchema>;

export const CreateCustomerDtoSchema = CustomerSchema.omit({ _id: true, insertedFromXmf: true });
export type CreateCustomerDto = z.infer<typeof CreateCustomerDtoSchema>;

export type CustomerFinancial = z.infer<typeof CustomerFinancialSchema>;
export type FtpUserData = z.infer<typeof FtpUserDataSchema>;
export type CustomerContact = z.infer<typeof CustomerContactSchema>;
