import { z } from 'zod/v4';

export const MessagePartBodySchema = z.object({
  attachmentId: z.string().optional(),
  size: z.number(),
  data: z.string().optional(),
  decoded: z.string().optional(),
});

export type MessagePartBody = z.infer<typeof MessagePartBodySchema>;
