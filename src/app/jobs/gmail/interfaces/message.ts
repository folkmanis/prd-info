import { MessagePart, MessagePartSchema } from './message-part';
import { Attachment } from './attachment';
import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  labelIds: z.array(z.string()),
  snippet: z.string().optional(),
  historyId: z.string(),
  internalDate: z.string(),
  payload: MessagePartSchema,
  sizeEstimate: z.number(),
  raw: z.string().optional(),
});

export class Message implements z.infer<typeof MessageSchema> {
  id: string;

  threadId: string;

  labelIds: string[];

  snippet?: string;

  historyId: string;

  internalDate: string;

  payload: MessagePart;

  sizeEstimate: number;

  raw?: string;

  constructor(message: z.infer<typeof MessageSchema>) {
    this.id = message.id;
    this.threadId = message.threadId;
    this.labelIds = message.labelIds;
    this.snippet = message.snippet;
    this.historyId = message.historyId;
    this.internalDate = message.internalDate;
    this.payload = new MessagePart(message.payload);
    this.sizeEstimate = message.sizeEstimate;
    this.raw = message.raw;
  }

  get from(): string | undefined {
    return this.payload.getHeader('From');
  }

  get hasAttachment(): boolean {
    return this.payload?.hasAttachment;
  }

  get attachments(): Attachment[] {
    return this.payload.attachments;
  }

  get hasPdf(): boolean {
    return this.attachments.some((attachment) => attachment.isPdf);
  }

  get plain(): string {
    return this.payload.plain.join(';\n\r');
  }

  get html(): string {
    return this.payload.html.join('<br />');
  }

  get subject(): string {
    return this.payload.getHeader('Subject') ?? '';
  }

  hasLabel(label: string): boolean {
    return this.labelIds.includes(label);
  }
}
