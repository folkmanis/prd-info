import { z } from 'zod';
import { JobMessageData } from './job-data';
import { XmfUploadMessageData } from './xmf-upload-data';

export const Message = z
  .object({
    _id: z.string(),
    timestamp: z.coerce.date(),
    seen: z.boolean(),
    deleted: z.boolean(),
    module: z.enum(['xmf-upload', 'jobs']),
    data: z.record(z.string(), z.any()),
    // data: z.union([z.instanceof(JobMessageData), z.instanceof(XmfUploadMessageData)]),
  })
  .transform((message) => {
    switch (message.module) {
      case 'jobs':
        return {
          ...message,
          data: new JobMessageData(message.data),
        };
      case 'xmf-upload':
        return {
          ...message,
          data: new XmfUploadMessageData(message.data),
        };
    }
  });

export type Message = z.infer<typeof Message>;
