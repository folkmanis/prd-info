import { z } from 'zod';
import { Message, MessageSchema } from './message';

export const ThreadSchema = z.object({
  id: z.string(),
  historyId: z.string(),
  snippet: z.string().optional(),
  messages: z.array(MessageSchema),
});

export class Thread implements z.infer<typeof ThreadSchema> {
  id: string;
  historyId: string;
  snippet?: string;
  messages: Message[];

  constructor(thread: z.infer<typeof ThreadSchema>) {
    this.id = thread.id;
    this.historyId = thread.historyId;
    this.snippet = thread.snippet;
    this.messages = thread.messages.map((message) => new Message(message));
  }

  get from(): string | undefined {
    return this.messages.find((msg) => msg.labelIds.every((label) => label !== 'SENT'))?.from;
  }

  get subject(): string | undefined {
    return this.messages[0]?.subject;
  }

  get plain(): string {
    return this.messages.map((message) => message.plain).join(';\r\n');
  }
}
