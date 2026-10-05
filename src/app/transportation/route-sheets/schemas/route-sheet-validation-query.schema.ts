import { stringToInt } from 'src/app/library';
import { z } from 'zod';

export const RouteSheetValidationQuerySchema = z.object({
  year: stringToInt,
  month: stringToInt,
  vehicle: z.string(),
  driver: z.string(),
});
export type RouteSheetValidationQuery = z.infer<typeof RouteSheetValidationQuerySchema>;
