import { stringToArray, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const MaterialQuerySchema = z
  .object({
    start: stringToInt,
    limit: stringToInt,
    name: z.string().trim(),
    inactive: z.stringbool(),
    categories: stringToArray(z.string()),
  })
  .partial();

export type MaterialsFilter = z.infer<typeof MaterialQuerySchema>;
export type MaterialsQuery = z.input<typeof MaterialQuerySchema>;
