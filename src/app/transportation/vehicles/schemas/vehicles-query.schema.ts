import { stringToArray, stringToInt } from 'src/app/library';
import { string, z } from 'zod';

export const VehiclesQuerySchema = z
  .object({
    start: stringToInt,
    limit: stringToInt,
    name: string(),
    disabled: z.stringbool(),
    fuelTypes: stringToArray(z.string()),
    licencePlate: z.string(),
  })
  .partial();

export type VehiclesQuery = z.infer<typeof VehiclesQuerySchema>;
