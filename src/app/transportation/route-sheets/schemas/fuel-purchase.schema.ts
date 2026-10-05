import { isoDateToDate } from 'src/app/library';
import { z } from 'zod';

export const FuelPurchaseSchema = z.object({
  date: isoDateToDate,
  type: z.string().nonempty(),
  units: z.string().nonempty(),
  amount: z.number(),
  price: z.number(),
  total: z.number(),
  invoiceId: z.string().optional(),
});
export type FuelPurchase = z.infer<typeof FuelPurchaseSchema>;
