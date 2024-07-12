import { endOfDay, startOfDay } from 'date-fns';

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
    date: Date,
  ) {
    this.dateFrom = startOfDay(date).toISOString();
    this.dateTo = endOfDay(date).toISOString();
  }
}
