import { z } from 'zod/v4';

export const JobProduct = z.object({
  name: z.string(),
  units: z.string(),
  price: z.number(),
  count: z.number(),
  comment: z.string().nullable().default(''),
});

export type JobProduct = z.infer<typeof JobProduct>;
