import moment from 'moment';

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

export class LogQueryFilter {

    limit?: number;
    start?: number;
    dateFrom: string;
    dateTo: string;

    constructor(
        public level: number,
        date: moment.Moment,
    ) {
        this.dateFrom = date.startOf('day').toISOString();
        this.dateTo = date.endOf('day').toISOString();
    }
};
