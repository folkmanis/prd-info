import { Type } from 'class-transformer';
import { Header } from './header';
import { MessagePartBody } from './message-part-body';

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
        return this.headers.find(h => h.name === name)?.value;
    }

    get hasAttachment(): boolean {
        return this.parts?.some(part => part.hasAttachment) === true || !!this.body?.attachmentId;
    }



}
