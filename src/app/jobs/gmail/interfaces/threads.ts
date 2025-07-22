import { z } from 'zod';
import { ThreadSchema } from './thread';

export const ThreadsSchema = z.object({
  threads: z.array(ThreadSchema.pick({ id: true, historyId: true, snippet: true })).default([]),
  nextPageToken: z.string().optional(),
  resultSizeEstimate: z.number().default(0),
});

export type Threads = z.infer<typeof ThreadsSchema>;
