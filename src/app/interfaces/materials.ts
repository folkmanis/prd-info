import { z } from 'zod/v4';

export const MaterialPrice = z.object({
  min: z.number(),
  price: z.number().default(0),
  description: z.string().nullish(),
});
export type MaterialPrice = z.infer<typeof MaterialPrice>;

export const Material = z.object({
  _id: z.string(),
  name: z.string(),
  units: z.string(),
  category: z.string(),
  inactive: z.coerce.boolean().default(false),
  prices: z.array(MaterialPrice).default([]),
  fixedPrice: z.coerce.number().default(0),
  description: z.string().nullish(),
});
export type Material = z.infer<typeof Material>;
