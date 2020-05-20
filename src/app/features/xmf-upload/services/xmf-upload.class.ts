export enum UPLOAD_STATE {
    NONE = 1 << 0,
    FILE_SELECTED = 1 << 1,
    UPLOADING = 1 << 2,
    PROCESSING = 1 << 3,
    FINISHED = 1 << 4,
}

export interface XmfUploadProgress {
    _id: string;
    started: Date | string;
    fileName: string;
    fileSize: number;
    username: string;
    state: 'uploading' | 'parsing' | 'saving' | 'finished';
    count: {
        [key: string]: number,
        processed: number,
        modified: number,
        upserted: number,
        lines: number,
    };
    finished: Date | string;
}

export type XmfUploadProgressTable = Partial<XmfUploadProgress>;

// TODO sākt ar tukšu progresu
export const EMPTY_PROGRESS: XmfUploadProgressTable = {
    _id: '',
    started: '',
    finished: '',
    fileName: '',
    fileSize: 0,
    count: {
        processed: 0,
        modified: 0,
        upserted: 0,
        lines: 0,
    }


};

export interface XmfUploadResponse {
    id: string;
    filename: string;
    size: number;
}
