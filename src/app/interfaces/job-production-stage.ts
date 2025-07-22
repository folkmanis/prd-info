import { z } from 'zod';

export const JobProductionStageMaterial = z.object({
  materialId: z.string(),
  amount: z.number(),
  fixedAmount: z.number(),
  cost: z.number().default(0),
});

export type JobProductionStageMaterial = z.infer<typeof JobProductionStageMaterial>;

export const JobProductionStage = z.object({
  productionStageId: z.string(),
  materials: z.array(JobProductionStageMaterial).default([]),
  amount: z.number(),
  fixedAmount: z.number(),
  productionStatus: z.number().default(10),
});

export type JobProductionStage = z.infer<typeof JobProductionStage>;

export function newJobProductionStage(): JobProductionStage {
  return {
    productionStageId: '',
    materials: [],
    amount: 0,
    fixedAmount: 0,
    productionStatus: 10,
  };
}

export function newJobProductionStageMaterial(): JobProductionStageMaterial {
  return {
    materialId: '',
    amount: 0,
    fixedAmount: 0,
    cost: 0,
  };
}
