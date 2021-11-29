export enum FileUploadEventType {
    UploadStart,
    UploadProgress,
    UploadWaiting,
    UploadFinish,
}

export interface UploadMessageBase {
    id: string;
    name: string;
    size: number;
}

interface UploadStartMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadStart;
    jobId: number;
}

interface UploadProgressMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadProgress;
    done: number;
    precentDone: number;
    jobId: number;
}

interface UploadFinishMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadFinish;
    jobId: number;
}

interface UploadWaitingMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadWaiting;
}

export type FileUploadMessage =
    UploadStartMessage |
    UploadProgressMessage |
    UploadFinishMessage |
    UploadWaitingMessage;
