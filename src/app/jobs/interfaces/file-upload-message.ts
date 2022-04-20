export enum FileUploadEventType {
    UploadStart,
    UploadProgress,
    UploadWaiting,
    UploadFinish,
    UploadAbort,
}

export interface UploadMessageBase {
    id: string;
    name: string;
    size: number;
}

interface UploadStartMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadStart;
}

interface UploadProgressMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadProgress;
    done: number;
    percentDone: number;
}

export interface UploadFinishMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadFinish;
    fileNames: string[];
}

export interface UploadWaitingMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadWaiting;
}

interface UploadAbortMessage extends UploadMessageBase {
    type: FileUploadEventType.UploadAbort;
}

export type FileUploadMessage =
    UploadStartMessage |
    UploadProgressMessage |
    UploadFinishMessage |
    UploadWaitingMessage |
    UploadAbortMessage;
