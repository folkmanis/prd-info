import { z } from 'zod';

export const MaterialPriceSchema = z.object({
  min: z.number(),
  price: z.number(),
  description: z.string().optional(),
});
export type MaterialPrice = z.infer<typeof MaterialPriceSchema>;

export const MaterialSchema = z.object({
  _id: z.string(),
  name: z.string(),
  units: z.string(),
  category: z.string(),
  inactive: z.boolean(),
  prices: z.array(MaterialPriceSchema),
  fixedPrice: z.number(),
  description: z.string().optional(),
});
export type Material = z.infer<typeof MaterialSchema>;

export const MaterialListSchema = MaterialSchema.pick({
  _id: true,
  name: true,
  description: true,
  category: true,
  inactive: true,
  units: true,
});
export type MaterialList = z.infer<typeof MaterialListSchema>;

export const MaterialCreateSchema = MaterialSchema.omit({ _id: true });
export type MaterialCreate = z.infer<typeof MaterialCreateSchema>;

export const MaterialUpdateSchema = z
  .object({ ...MaterialCreateSchema.shape, description: z.string().nullable() })
  .partial();
export type MaterialUpdate = z.infer<typeof MaterialUpdateSchema>;

export const newMaterial: () => Material = () => ({
  _id: '',
  name: '',
  units: '',
  category: '',
  inactive: false,
  prices: [],
  fixedPrice: 0,
});
