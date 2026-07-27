import { optionalString } from 'src/app/library';
import { z } from 'zod';

export const EquipmentFilterSchema = z
  .object({
    name: optionalString,
  })
  .partial();
export type EquipmentFilter = z.infer<typeof EquipmentFilterSchema>;
