import { z } from 'zod/v4';
import { Attachment } from './attachment';
import { Header, HeaderSchema } from './header';
import { MessagePartBody, MessagePartBodySchema } from './message-part-body';

export const MessagePartSchema = z.object({
  partId: z.string(),

  mimeType: z.string(),

  filename: z.string().optional(),
  headers: HeaderSchema.array(),

  body: MessagePartBodySchema.optional(),

  get parts() {
    return MessagePartSchema.array().optional();
  },
});

export class MessagePart implements z.infer<typeof MessagePartSchema> {
  partId: string;
  mimeType: string;
  filename?: string;
  headers: Header[];
  body?: MessagePartBody;
  parts?: MessagePart[];

  constructor(part: z.infer<typeof MessagePartSchema>) {
    this.partId = part.partId;
    this.mimeType = part.mimeType;
    this.filename = part.filename;
    this.headers = part.headers;
    this.body = part.body;
    this.parts = part.parts?.map((p) => new MessagePart(p));
  }

  getHeader(name: string): string | undefined {
    return this.headers.find((h) => h.name.toUpperCase() === name.toUpperCase())?.value;
  }

  get hasAttachment(): boolean {
    return this.parts?.some((part) => part.hasAttachment) === true || !!this.body?.attachmentId;
  }

  get attachments(): Attachment[] {
    if (!this.hasAttachment) {
      return [];
    }
    const partsAttachments = (this.parts || []).map((part) => part.attachments).reduce((acc, curr) => acc.concat(...curr), []);
    if (!this.body?.attachmentId) {
      return partsAttachments;
    }
    let filename = this.filename;
    if (!filename) {
      filename = this.headers?.find((header) => header.name === 'Content-Disposition')?.value.match(/filename="(.+)"/)?.[1];
    }
    const attachment = new Attachment(filename, this.body.attachmentId, this.body.size);
    return [...partsAttachments, attachment];
  }

  get plain(): string[] {
    return this.mimeTypeContents('text/plain').map((part) => part.trim());
  }

  get html(): string[] {
    return this.mimeTypeContents('text/html');
  }

  mimeTypeContents(mimeType: string): string[] {
    const partsMsgs = this.parts?.map((part) => part.plain).reduce((acc, curr) => [...acc, ...curr], []) || [];
    if (this.mimeType !== mimeType) {
      return partsMsgs;
    }
    if (this.body?.decoded) {
      return [...partsMsgs, this.body.decoded];
    }
    return partsMsgs;
  }
}
