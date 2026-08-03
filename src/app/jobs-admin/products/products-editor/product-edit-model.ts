import { z } from 'zod';
import { Product, ProductPriceSchema, ProductProductionStage, ProductSchema } from 'src/app/interfaces';

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
