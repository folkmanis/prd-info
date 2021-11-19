import { MessageBase } from './message-base';
import { XmfUploadProgress } from '../xmf-search';

export type XmfUploadMessage = MessageBase & {
    module: 'xmf-upload';
    data: XmfUploadProgress,
};
