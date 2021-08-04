import { AppHttpResponseBase } from 'src/app/library/http/app-http-response-base';
import { Modules } from './system-preferences';


export interface MessageBase {
    _id: string;
    timestamp: Date;
    seen: boolean;
    deleted: boolean;
    alert: boolean;
    readonly module: Modules;
}

export type JobMessageActions = 'jobUpdate' | 'ftpUpload';

interface JobDataUpdate {
    action: 'jobUpdate',
    jobId: number;
    operation: 'create' | 'delete' | 'update';
}

export type FsOperations = 'add' | 'addDir' | 'change' | 'unlink' | 'ready';

export interface JobFtpUpdate {
    action: 'ftpUpload',
    operation: FsOperations;
    path: string[];
}

type JobOrFtp<T extends JobMessageActions> = T extends 'jobUpdate' ? JobDataUpdate : JobFtpUpdate;

export type JobMessage<T extends JobMessageActions> = MessageBase & {
    module: 'jobs';
    data: JobOrFtp<T>,
};

export type Message<T extends JobMessageActions = any> = JobMessage<T>;

export interface MessageResponse<T extends JobMessageActions = any> extends AppHttpResponseBase<Message<T>> {
    timestamp: string;
}