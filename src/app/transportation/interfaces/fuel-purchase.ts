import { FuelType } from 'src/app/interfaces';
import { z } from 'zod';

export const FuelPurchase = z.object({
  date: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  type: z.string(),
  units: z.string(),
  amount: z.number().default(0),
  price: z.number().default(0),
  total: z.number(),
  invoiceId: z.string().nullish(),
});
export type FuelPurchase = z.infer<typeof FuelPurchase>;

export function newFuelPurchase(fuelType?: FuelType): FuelPurchase {
  const purchase: FuelPurchase = {
    date: new Date(),
    type: '',
    units: '',
    amount: 0,
    price: 0,
    total: 0,
    invoiceId: undefined,
  };
  if (fuelType) {
    purchase.type = fuelType.type;
    purchase.units = fuelType.units;
  }
  return purchase;
}
