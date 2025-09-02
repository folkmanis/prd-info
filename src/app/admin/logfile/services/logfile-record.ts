import { endOfDay, startOfDay } from 'date-fns';
import { z } from 'zod';

export const LogRecordSchema = z.object({
  _id: z.string(),
  level: z.number(),
  timestamp: z.coerce.date(),
  info: z.string(),
  metadata: z.array(z.any()),
});
export type LogRecord = z.infer<typeof LogRecordSchema>;

export interface LogQueryFilter {
  level: number;
  dateFrom: string;
  dateTo: string;
  limit?: number;
  start?: number;
}

export function createLogQueryFilter(level: number, date: Date, limit?: number, start?: number): LogQueryFilter {
  return {
    level,
    dateFrom: startOfDay(date).toISOString(),
    dateTo: endOfDay(date).toISOString(),
    limit,
    start,
  };
}
