export enum FileUploadEventType {
    UploadStart,
    UploadProgress,
    UploadWaiting,
    UploadFinish,
}

export interface UploadMessageBase {
    id: string;
    jobId: number;
    name: string;
    size: number;
}

interface UploadStartMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadStart;
}

interface UploadProgressMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadProgress;
    done: number;
    precentDone: number;
}

interface UploadFinishMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadFinish;
}

interface UploadWaitingMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadWaiting;
}

export type FileUploadMessage =
    UploadStartMessage |
    UploadProgressMessage |
    UploadFinishMessage |
    UploadWaitingMessage;
