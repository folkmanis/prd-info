export interface XmfUploadProgress {
    _id: string,
    started: Date,
    fileName: string,
    fileSize: string,
    username: string,
    state: 'uploading' | 'parsing' | 'saving' | 'finished',
    count: {
        [key: string]: number,
        processed: number,
        modified: number,
        upserted: number,
        lines: number,
    };
    finished: Date,
}

export interface XmfUploadResponse {
    id: string,
    filename: string,
    size: number,
}