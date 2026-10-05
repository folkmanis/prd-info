import { optionalString } from 'src/app/library';
import { FuelPurchase } from '../../schemas';
import { z } from 'zod';

const FuelPurchaseModelSchema = z.object({
  date: z.date(),
  type: z.string().nonempty(),
  units: z.string().nonempty(),
  amount: z.number(),
  price: z.number(),
  total: z.number(),
  invoiceId: optionalString,
});
export type FuelPurchaseModel = z.infer<typeof FuelPurchaseModelSchema>;

export function toModel(fp: FuelPurchase): FuelPurchaseModel {
  return FuelPurchaseModelSchema.decode(fp);
}

export function fromModel(model: FuelPurchaseModel): FuelPurchase {
  return FuelPurchaseModelSchema.encode(model);
}
