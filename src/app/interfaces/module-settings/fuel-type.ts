import { z } from 'zod';

export const FuelType = z.object({
  type: z.string(),
  description: z.string(),
  units: z.string(),
});

export type FuelType = z.infer<typeof FuelType>;
