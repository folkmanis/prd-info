import { z } from 'zod';

export const fuelTypeSchema = z.object({
  type: z.string(),
  description: z.string(),
  units: z.string(),
});

export type FuelType = z.infer<typeof fuelTypeSchema>;
