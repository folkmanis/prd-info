import { z } from 'zod/v4';
import { MessageData } from './message-data';

const FS_ACTIONS: {
  operation: FsOperations;
  action: string;
}[] = [
  { operation: 'addDir', action: 'Izveidots folderis' },
  { operation: 'add', action: 'Jauns fails' },
  { operation: 'change', action: 'Mainīts fails' },
  { operation: 'unlink', action: 'Izdzēsts fails' },
];

export const MessageFtpUser = z.object({
  _id: z.string(),
  CustomerName: z.string(),
  code: z.string(),
  folder: z.string(),
});
export type MessageFtpUser = z.infer<typeof MessageFtpUser>;

export const FsOperationsEnum = z.enum(['add', 'addDir', 'change', 'unlink', 'ready']);
export type FsOperations = z.infer<typeof FsOperationsEnum>;

export const jobMesageDataSchema = z.object({
  action: z.literal('ftpUpload'),
  operation: FsOperationsEnum,
  path: z.array(z.string()),
  ftpUsers: z.array(MessageFtpUser),
});

export class JobMessageData implements MessageData, z.infer<typeof jobMesageDataSchema> {
  action: 'ftpUpload' = 'ftpUpload';
  operation: FsOperations = 'add';
  path: string[] = [];

  ftpUsers: MessageFtpUser[] = [];

  constructor(obj: Record<string, any> = {}) {
    Object.assign(this, obj);
  }

  toAction() {
    if (this.action === 'ftpUpload') {
      return FS_ACTIONS.find((act) => act.operation === this.operation)?.action || '';
    }
    return '';
  }

  toDescription() {
    return (this.action === 'ftpUpload' && this.path.join('/')) || '';
  }
}
