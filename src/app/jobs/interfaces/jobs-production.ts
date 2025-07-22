import { ProductSchema } from 'src/app/interfaces/product';
import { z } from 'zod';

export const JobsProduction = ProductSchema.pick({
  _id: true,
  name: true,
  units: true,
  category: true,
  description: true,
  inactive: true,
}).extend({
  sum: z.coerce.number(),
  count: z.coerce.number(),
  total: z.coerce.number(),
});
export type JobsProduction = z.infer<typeof JobsProduction>;
