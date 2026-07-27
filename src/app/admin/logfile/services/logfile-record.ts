import { isoDateToDate, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const LogRecordSchema = z.object({
  level: z.number(),
  timestamp: z.coerce.date(),
  info: z.string(),
  metadata: z.array(z.any()),
});
export type LogRecord = z.infer<typeof LogRecordSchema>;

export const LogFilterSchema = z
  .object({
    level: stringToInt,
    dateFrom: isoDateToDate,
    dateTo: isoDateToDate,
    limit: stringToInt,
    start: stringToInt,
  })
  .partial();
export type LogFilter = z.infer<typeof LogFilterSchema>;
