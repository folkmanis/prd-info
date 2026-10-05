import { z } from 'zod';

export const DriverQuerySchema = z
  .object({
    name: z.string(),
    email: z.string(),
    disabled: z.stringbool(),
  })
  .partial();
export type DriverQuery = z.infer<typeof DriverQuerySchema>;
