import { Thread } from './thread';
import { Type } from 'class-transformer';


export class Threads {

    @Type(() => Thread)
    threads: Pick<Thread, 'id' | 'historyId' | 'snippet'>[] = [];

    nextPageToken?: string;

    resultSizeEstimate: number;

}
