import { z } from 'zod';

export const DropFolderSchema = z.object({
  path: z.array(z.string()),
  customers: z.array(z.string()),
});
export type DropFolder = z.infer<typeof DropFolderSchema>;

export const ProductionStageSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  defaultEquipmentId: z.string().optional(),
  equipmentIds: z.string().array(),
  disabled: z.boolean(),
  dropFolders: DropFolderSchema.array(),
});
export type ProductionStage = z.infer<typeof ProductionStageSchema>;

export const ProductionStageListSchema = ProductionStageSchema.pick({
  _id: true,
  name: true,
  equipmentIds: true,
  disabled: true,
});
export type ProductionStageList = z.infer<typeof ProductionStageListSchema>;

export const CreateProductionStageSchema = z
  .object({ ...ProductionStageSchema.shape, description: z.string().trim() })
  .omit({ _id: true });
export type CreateProductionStage = z.infer<typeof CreateProductionStageSchema>;

export const UpdateProductionStageSchema = z
  .object({
    ...ProductionStageSchema.shape,
    description: z.string().trim().nullable(),
    defaultEquipmentId: z.string().nullable(),
  })
  .omit({ _id: true })
  .partial();
export type UpdateProductionStage = z.infer<typeof UpdateProductionStageSchema>;
