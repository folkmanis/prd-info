import { z } from 'zod';
import { JobMessageData } from './job-data';
import { XmfUploadMessageData } from './xmf-upload-data';

export const Message = z.object({
  _id: z.string(),
  timestamp: z.coerce.date(),
  seen: z.boolean(),
  deleted: z.boolean(),
  module: z.enum(['xmf-upload', 'jobs']),
  data: z.union([z.instanceof(JobMessageData), z.instanceof(XmfUploadMessageData)]),
});

export type Message = z.infer<typeof Message>;
