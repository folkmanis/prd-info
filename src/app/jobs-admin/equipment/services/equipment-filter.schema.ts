import { optionalString, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const EquipmentFilterSchema = z
  .object({
    name: optionalString,
    disabled: z.stringbool(),
    start: stringToInt,
    limit: stringToInt,
  })
  .partial();
export type EquipmentFilter = z.infer<typeof EquipmentFilterSchema>;
