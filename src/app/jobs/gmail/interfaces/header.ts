import { z } from 'zod';

export const HeaderSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export type Header = z.infer<typeof HeaderSchema>;
