import { Type } from 'class-transformer';
import { MessagePart } from './message-part';
import { Attachment } from './attachment';


export class Message {

    id: string;

    threadId: string;

    labelIds: string[];

    snippet: string;

    historyId: string;

    internalDate: string;

    @Type(() => MessagePart)
    payload: MessagePart;

    sizeEstimate: number;

    raw?: string;

    get from(): string | undefined {
        return this.payload.getHeader('From');
    }

    get hasAttachment(): boolean {
        return this.payload?.hasAttachment;
    }

    get attachments(): Attachment[] {
        return this.payload.attachments;
    }

    get plain(): string {
        return this.payload.plain.join(';\n\r');
    }

    get html(): string {
        return this.payload.html.join('<br />');
    }

    get subject(): string {
        return this.payload.getHeader('Subject');
    }


}