import { z } from 'zod';

export const ShippingAddress = z.object({
  address: z.string(),
  zip: z.string(),
  country: z.string(),
  paytraqId: z.number().optional(),
  googleId: z.string().optional(),
});

export type ShippingAddress = z.infer<typeof ShippingAddress>;
