import { Type } from 'class-transformer';

export class XmfUploadProgress {
  _id: string;

  @Type(() => Date)
  started: Date;

  fileName: string;
  fileSize: number;
  username: string;
  state: 'uploading' | 'parsing' | 'saving' | 'finished';
  count: {
    processed: number;
    modified: number;
    upserted: number;
    lines: number;
  };

  @Type(() => Date)
  finished: Date;
}
