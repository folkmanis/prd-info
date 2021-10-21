export interface XmfUploadHistory {
    _id: string;
    started: Date | string;
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
    finished: Date | string;
}
