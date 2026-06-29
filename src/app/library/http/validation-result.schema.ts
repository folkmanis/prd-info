import { z } from 'zod';

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  property: z.string(),
  value: z.unknown(),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
