import { z } from 'zod';

export const MessageModifiedResponseSchema = z.object({
  modifiedId: z.string(),
});
export type MessageModifiedResponse = z.infer<typeof MessageModifiedResponseSchema>;
