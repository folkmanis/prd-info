import { z } from 'zod';

export const ProductProductionStageMaterial = z.object({
  materialId: z.string(),
  amount: z.number(),
  fixedAmount: z.number(),
});
export type ProductProductionStageMaterial = z.infer<typeof ProductProductionStageMaterial>;

export const ProductProductionStage = z.object({
  productionStageId: z.string(),
  amount: z.number(),
  fixedAmount: z.number(),
  materials: z.array(ProductProductionStageMaterial),
});
export type ProductProductionStage = z.infer<typeof ProductProductionStage>;
