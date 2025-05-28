import { z } from 'zod/v4';

export const SystemSettings = z.object({
  menuExpandedByDefault: z.boolean(),
  logLevels: z.array(z.tuple([z.number(), z.string()])),
  hostname: z.string(),
  companyName: z.string(),
});
export type SystemSettings = z.infer<typeof SystemSettings>;
