import { z } from 'zod';

export const FuelPurchase = z.object({
  date: z.coerce.date(),
  type: z.string(),
  units: z.string(),
  amount: z.number().default(0),
  price: z.number().default(0),
  total: z.number(),
  invoiceId: z.string().nullish(),
});
export type FuelPurchase = z.infer<typeof FuelPurchase>;
