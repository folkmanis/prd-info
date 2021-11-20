import { JobData } from './job-data';
import { MessageData } from './message-data';
import { XmfUploadData } from './xmf-upload-data';
import { Type } from 'class-transformer';
import { Modules } from '../../../interfaces/system-preferences';

export class Message {

    _id: string;

    @Type(() => Date)
    timestamp: Date;

    seen: boolean;

    deleted: boolean;

    module: Modules;

    @Type(() => MessageData, {
        discriminator: {
            property: '_type',
            subTypes: [
                { value: JobData, name: 'jobs' },
                { value: XmfUploadData, name: 'xmf-upload' },
            ]
        }
    })
    data: JobData | XmfUploadData;
}
