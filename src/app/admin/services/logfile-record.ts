export interface LogRecordHttp {
    _id: string;
    level: number;
    timestamp: string;
    info: string;
    metadata: string[];
}

export type LogRecord = LogRecordHttp & {
    levelVerb: string;
};

export type LogQueryFilter = Partial<{
    limit: number;
    start: number;
    level: number;
    dateFrom: string;
    dateTo: string;
}>;
