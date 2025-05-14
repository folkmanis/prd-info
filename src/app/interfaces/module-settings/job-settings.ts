import { z } from 'zod';

export const ProductCategory = z.object({
  category: z.string(),
  description: z.string(),
});
export type ProductCategory = z.infer<typeof ProductCategory>;

export const JobState = z.object({
  state: z.number(),
  description: z.string(),
});
export type JobState = z.infer<typeof JobState>;

export const ProductUnit = z.object({
  shortName: z.string(),
  description: z.string(),
  disabled: z.boolean(),
});
export type ProductUnit = z.infer<typeof ProductUnit>;

export const JobsSettings = z.object({
  productCategories: ProductCategory.array(),
  jobStates: JobState.array(),
  productUnits: ProductUnit.array(),
});
export type JobsSettings = z.infer<typeof JobsSettings>;
