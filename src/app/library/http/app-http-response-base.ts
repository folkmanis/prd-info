export interface AppHttpResponseBase<T = any> {
    [key: string]: any;
    error: any;
    insertedId?: string | number;
    deletedCount?: number;
    modifiedCount?: number;
    insertedCount?: number;
    result?: {
        ok: number;
        n: number;
    };
    data?: Partial<T>[] | T;
    validatorData?: T[keyof T & string][];
}
