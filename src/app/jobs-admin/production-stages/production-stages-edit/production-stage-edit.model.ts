import {
  CreateProductionStage,
  DropFolderSchema,
  ProductionStage,
  UpdateProductionStage,
} from 'src/app/interfaces/production-stage';
import { nullableString, pickNotNull } from 'src/app/library';
import { z } from 'zod';

export const defaultEquipmentIdSchema = z.codec(z.string().nullable().optional(), z.string().nullable(), {
  decode: (str) => str ?? null,
  encode: (str) => str || null,
});

export const ProductionStageModelSchema = z.object({
  name: z.string().trim(),
  description: nullableString,
  defaultEquipmentId: defaultEquipmentIdSchema,
  equipmentIds: z.string().array(),
  disabled: z.boolean(),
  dropFolders: DropFolderSchema.array(),
});
export type ProductionStageModel = z.infer<typeof ProductionStageModelSchema>;

export function productionStageToModel(productionStage: ProductionStage): ProductionStageModel {
  return ProductionStageModelSchema.decode(productionStage);
}

export function modelToProductionStageCreate(model: ProductionStageModel): CreateProductionStage {
  const productionStage = ProductionStageModelSchema.encode(model);
  return pickNotNull(productionStage);
}

export function modelToProductionStageUpdate(model: Partial<ProductionStageModel>): UpdateProductionStage {
  const productionStage = ProductionStageModelSchema.partial().encode(model);
  return productionStage;
}
