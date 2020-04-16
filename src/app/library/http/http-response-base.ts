export interface AppHttpResponseBase {
    [key: string]: any;
    error: any;
    insertedId?: string;
    deletedCount?: number;
    modifiedCount?: number;
    result?: {
        ok: number;
        n: number;
    };
}
