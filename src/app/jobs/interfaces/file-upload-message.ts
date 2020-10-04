export enum FileUploadEventType {
    UploadStart,
    UploadProgress,
    UploadFinish,
    UploadClose,
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

interface UploadCloseMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadClose;
}

export type FileUploadMessage = UploadStartMessage | UploadProgressMessage | UploadFinishMessage | UploadCloseMessage;
