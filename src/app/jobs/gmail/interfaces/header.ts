import { z } from 'zod/v4';

export const HeaderSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export type Header = z.infer<typeof HeaderSchema>;
