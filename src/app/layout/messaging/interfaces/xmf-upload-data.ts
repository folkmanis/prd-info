import { XmfUploadProgress } from 'src/app/xmf-upload/interfaces/xmf-upload-progress';
import { MessageData } from './message-data';
import * as filesize from 'filesize';

export class XmfUploadData extends XmfUploadProgress implements MessageData {

    toAction() {
        if (this.state === 'finished') {
            return 'Pievienoti dati no XMF arhīva';
        }
        return '';
    }

    toDescription() {
        return `${this.fileName} (${filesize(this.fileSize)})`;
    }
};
