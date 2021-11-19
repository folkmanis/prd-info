import { MessageBase } from './message-base';

export type FsOperations = 'add' | 'addDir' | 'change' | 'unlink' | 'ready';

export interface JobFtpUpdate {
    action: 'ftpUpload';
    operation: FsOperations;
    path: string[];
}

export type JobMessage = MessageBase & {
    module: 'jobs';
    data: JobFtpUpdate;
};
