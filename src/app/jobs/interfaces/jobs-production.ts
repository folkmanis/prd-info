import { Product } from 'src/app/interfaces';
import { z } from 'zod/v4';

export const JobsProduction = Product.pick({
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
