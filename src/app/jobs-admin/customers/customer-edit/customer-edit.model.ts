import { ShippingAddressModelSchema } from 'src/app/interfaces';
import {
  CreateCustomerDto,
  Customer,
  CustomerContactSchema,
  CustomerFinancialSchema,
  FtpUserData,
  FtpUserDataSchema,
  UpdateCustomerDto,
} from 'src/app/interfaces/customer';
import { nullableString, optionalNumberToString, optionalString, pickNotNull } from 'src/app/library';
import { z } from 'zod';

const FtpUserDataModelSchema = z
  .codec(
    FtpUserDataSchema.nullable().optional(),
    z.object({
      folder: z.string(),
      username: optionalString,
      password: optionalString,
    }),
    {
      decode: (value) => value ?? { folder: '' },
      encode: (value) => {
        if (value.folder) {
          return value as FtpUserData;
        } else {
          return null;
        }
      },
    },
  )
  .prefault({ folder: '' });

export const defaultShippingAddressModel = () => ShippingAddressModelSchema.decode(undefined);

const CustomerFinancialModelSchema = z.codec(
  CustomerFinancialSchema.nullable().optional(),
  z.object({
    clientName: optionalString,
    paytraqId: optionalNumberToString,
  }),
  {
    decode: (value) => value ?? {},
    encode: ({ clientName, paytraqId }) => {
      if (typeof paytraqId === 'number' && clientName) {
        return { paytraqId, clientName };
      } else {
        return null;
      }
    },
  },
);
export type CustomerFinancialModel = z.infer<typeof CustomerFinancialModelSchema>;

const CustomerContactsModelSchema = z.codec(
  CustomerContactSchema.array().nullable().optional(),
  CustomerContactSchema.array(),
  {
    decode: (value) => value ?? [],
    encode: (value) => (value.length === 0 ? null : value),
  },
);

export const CustomerModelSchema = z.object({
  customerName: z.string(),
  code: z.string().toUpperCase(),
  description: nullableString,
  ftpUserData: FtpUserDataModelSchema,
  disabled: z.boolean(),
  contacts: CustomerContactsModelSchema,
  shippingAddress: ShippingAddressModelSchema,
  financial: CustomerFinancialModelSchema,
});
export type CustomerModel = z.infer<typeof CustomerModelSchema>;

export function customerToModel(customer: Customer): CustomerModel {
  return CustomerModelSchema.decode(customer);
}

export function modelToCreateCustomer(model: CustomerModel): CreateCustomerDto {
  const customer = CustomerModelSchema.encode(model);
  return pickNotNull(customer);
}

export function modelToUpdateCustomer(model: Partial<CustomerModel>): UpdateCustomerDto {
  const customer = CustomerModelSchema.partial().encode(model);
  return customer;
}
