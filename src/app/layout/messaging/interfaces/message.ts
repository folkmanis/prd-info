import { z } from 'zod';
import { JobData } from './job-data';
import { XmfUploadData } from './xmf-upload-data';

export const Message = z.object({
  _id: z.string(),
  timestamp: z.coerce.date(),
  seen: z.boolean(),
  deleted: z.boolean(),
  module: z.enum(['xmf-upload', 'jobs']),
  data: z.union([z.instanceof(JobData), z.instanceof(XmfUploadData)]),
});

export type Message = z.infer<typeof Message>;
