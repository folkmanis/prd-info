import { z } from 'zod';

export const ShippingAddress = z.object({
  address: z.string(),
  zip: z.string(),
  country: z.string(),
  paytraqId: z.coerce.number().nullish(),
  googleId: z.string().nullish(),
});

export type ShippingAddress = z.infer<typeof ShippingAddress>;
