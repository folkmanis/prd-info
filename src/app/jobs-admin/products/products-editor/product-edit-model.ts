import { ProductPriceSchema, ProductProductionStage } from 'src/app/interfaces';
import { z } from 'zod';

export const ProductEditSchema = z.object({
  inactive: z.boolean().default(false),
  category: z.string(),
  name: z.string(),
  units: z.string(),
  paytraqId: z.number().nullish(),
  description: z.string().nullish(),
  prices: z.array(ProductPriceSchema).default([]),
  productionStages: z.array(ProductProductionStage).default([]),
});
