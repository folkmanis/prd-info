import { Type } from 'class-transformer';
import { Header } from './header';
import { MessagePartBody } from './message-part-body';
import { Attachment } from './attachment';

export class MessagePart {
  partId: string;

  mimeType: string;

  filename?: string;

  @Type(() => Header)
  headers: Header[];

  @Type(() => MessagePartBody)
  body?: MessagePartBody;

  @Type(() => MessagePart)
  parts?: MessagePart[];

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
