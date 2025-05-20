import { z } from 'zod';

export const FileElement = z.object({
  id: z.string().nullish(),
  isFolder: z.boolean().default(false),
  name: z.string(),
  parent: z.string().array().default([]),
});
export type FileElement = z.infer<typeof FileElement>;
