import { Type } from 'class-transformer';
import { Message } from './message';

export class Thread {

    id: string;

    historyId: string;

    snippet: string;

    @Type(() => Message)
    messages: Message[];

    get from(): string | undefined {
        return this.messages.find(msg => msg.labelIds.every(label => label !== 'SENT'))?.from;
    }

    get subject(): string | undefined {
        return this.messages[0]?.subject;
    }

    get plain(): string {
        return this.messages.map(message => message.plain).join(';\r\n');
    }


}
