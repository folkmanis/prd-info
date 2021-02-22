export interface LogDataHttp {
    count: number;
    data: LogRecordHttp[];
}

export interface LogData extends LogDataHttp {
    data: LogRecord[];
}

export interface LogRecordHttp {
    level: number;
    timestamp: Date;
    info: string;
    metadata: { [key: string]: any };
}

export type LogRecord = LogRecordHttp & {
    levelVerb: string;
};

export type GetLogEntriesParams = Partial<{
    limit: number;
    start: number;
    level: number;
    dateTo: string;
    dateFrom: string;
}>;
