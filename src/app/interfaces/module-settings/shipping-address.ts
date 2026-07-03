import { applyWhenValue, required, SchemaPathTree } from '@angular/forms/signals';
import { optionalNumberToString, optionalString } from 'src/app/library';
import { z } from 'zod';

export const ShippingAddressSchema = z.object({
  address: z.string(),
  zip: z.string(),
  country: z.string(),
  paytraqId: z.number().optional(),
  googleId: z.string().optional(),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const ShippingAddressModelSchema = z.codec(
  ShippingAddressSchema.nullable().optional(),
  z.object({
    address: z.string(),
    zip: z.string(),
    country: z.string(),
    paytraqId: optionalNumberToString,
    googleId: optionalString,
  }),
  {
    decode: (value) => value ?? { address: '', zip: '', country: '' },
    encode: (value) => {
      if (value.address) {
        return value;
      } else {
        return null;
      }
    },
  },
);
export type ShippingAddressModel = z.infer<typeof ShippingAddressModelSchema>;

export function validateShippingAddress(path: SchemaPathTree<ShippingAddressModel>) {
  applyWhenValue(
    path,
    (value) => !!value.address,
    (s) => {
      required(s.country);
      required(s.zip);
    },
  );
}
