export interface AppHttpResponseBase<T = any> {
    [key: string]: any;
    error: any;
    insertedId?: string | number;
    deletedCount?: number;
    modifiedCount?: number;
    result?: {
        ok: number;
        n: number;
    };
    data?: Partial<T>[] | T;
    validatorData?: T[keyof T][];
}
