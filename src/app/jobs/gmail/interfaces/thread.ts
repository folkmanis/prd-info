import { Type } from 'class-transformer';
import { Message } from './message';

export class Thread {

    id: string;

    historyId: string;

    snippet: string;

    @Type(() => Message)
    messages: Message[];

    get from(): string {
        return this.messages[0]?.from;
    }


}
