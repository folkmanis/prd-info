import { z } from 'zod';

export const PaytraqConnectionParams = z.object({
  connectUrl: z.string(),
  connectKey: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
  apiToken: z.string(),
  invoiceUrl: z.string(),
});
export type PaytraqConnectionParams = z.infer<typeof PaytraqConnectionParams>;

export const PaytraqSettings = z.object({
  enabled: z.boolean(),
  connectionParams: PaytraqConnectionParams.nullable(),
});
export type PaytraqSettings = z.infer<typeof PaytraqSettings>;
