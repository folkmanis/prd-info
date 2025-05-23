import { XmfUploadProgress } from 'src/app/xmf-upload/interfaces/xmf-upload-progress';
import { MessageData } from './message-data';
import { filesize } from 'filesize';

export class XmfUploadMessageData implements MessageData, XmfUploadProgress {
  _id = '';
  started = new Date();
  fileName = '';
  fileSize = 0;
  username = '';
  state: 'uploading' | 'parsing' | 'saving' | 'finished' = 'uploading';
  count = {
    processed: 0,
    modified: 0,
    upserted: 0,
    lines: 0,
  };
  finished = new Date();

  constructor(obj: Record<string, any> = {}) {
    Object.assign(this, obj);
  }

  toAction() {
    if (this.state === 'finished') {
      return 'Pievienoti dati no XMF arhīva';
    }
    return '';
  }

  toDescription() {
    return `${this.fileName} (${filesize(this.fileSize)})`;
  }
}
