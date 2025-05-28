import { z } from 'zod/v4';

export const FileElement = z.object({
  id: z.string().nullish(),
  isFolder: z.boolean().default(false),
  name: z.string(),
  parent: z.array(z.string()).default([]),
});
export type FileElement = z.infer<typeof FileElement>;
