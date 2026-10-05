import { stringToArray, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const RouteSheetQuerySchema = z
  .object({
    disabled: z.stringbool(),
    fuelTypes: stringToArray(z.string()),
    year: stringToInt,
    month: stringToInt,
    name: z.string(),
    vehicleId: z.string(),
  })
  .partial();
export type RouteSheetQuery = z.infer<typeof RouteSheetQuerySchema>;
