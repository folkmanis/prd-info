import { z } from 'zod/v4';

export const XmfUploadProgress = z.object({
  _id: z.string(),
  started: z.coerce.date(),
  fileName: z.string(),
  fileSize: z.number(),
  username: z.string(),
  state: z.enum(['uploading', 'parsing', 'saving', 'finished']),
  count: z.object({
    processed: z.number(),
    modified: z.number(),
    upserted: z.number(),
    lines: z.number(),
  }),
  finished: z.coerce.date(),
});
export type XmfUploadProgress = z.infer<typeof XmfUploadProgress>;
