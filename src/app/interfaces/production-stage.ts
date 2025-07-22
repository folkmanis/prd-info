import { z } from 'zod';

export const DropFolder = z.object({
  path: z.array(z.string()),

  customers: z.array(z.string()),
});
export type DropFolder = z.infer<typeof DropFolder>;

export const ProductionStage = z.object({
  _id: z.string(),

  name: z.string(),

  description: z.string().nullish(),

  equipmentIds: z.array(z.string()).default([]),

  dropFolders: z.array(DropFolder).default([]),
});
export type ProductionStage = z.infer<typeof ProductionStage>;

export const CreateProductionStage = ProductionStage.omit({ _id: true });
export type CreateProductionStage = z.infer<typeof CreateProductionStage>;

export const UpdateProductionStage = ProductionStage.omit({ _id: true }).partial();
export type UpdateProductionStage = z.infer<typeof UpdateProductionStage>;
