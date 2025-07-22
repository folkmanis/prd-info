import { z } from 'zod';

const labelMap: Map<string, string> = new Map([
  ['IMPORTANT', 'Svarīgi'],
  ['TRASH', 'Miskaste'],
  ['DRAFT', 'Melnraksti'],
  ['SPAM', 'Mēstules'],
  ['STARRED', 'Ar zvaigznīti'],
  ['CATEGORY_PERSONAL', 'Personīgi'],
]);

export function getLabelDisplayName(id: string) {
  return labelMap.get(id) || id;
}

export const LabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  // messageListVisibility: z.enum(['show', 'hide']),
  // labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']),
  type: z.enum(['system', 'user']),
  messagesTotal: z.number(),
  messagesUnread: z.number(),
  threadsTotal: z.number(),
  threadsUnread: z.number(),
  color: z.object({
    textColor: z.string(),
    backgroundColor: z.string(),
  }),
});

export type Label = z.infer<typeof LabelSchema>;

export const LabelListItemSchema = LabelSchema.pick({
  id: true,
  name: true,
  // messageListVisibility: true,
  // labelListVisibility: true,
});

export type LabelListItem = z.infer<typeof LabelListItemSchema>;
