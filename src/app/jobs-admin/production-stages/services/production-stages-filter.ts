import { optionalString, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const ProductionStagesFilterSchema = z
  .object({
    name: optionalString,
    disabled: z.stringbool(),
    start: stringToInt,
    limit: stringToInt,
  })
  .partial();
export type ProductionStagesFilter = z.infer<typeof ProductionStagesFilterSchema>;
