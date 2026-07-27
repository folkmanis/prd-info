import { isoDateToDate, stringToArray, stringToInt } from 'src/app/library';
import { z } from 'zod';

export const JobsProductionFilterSchema = z
  .object({
    start: stringToInt,
    limit: stringToInt,
    sort: z.string(),
    fromDate: isoDateToDate,
    toDate: isoDateToDate,
    jobStatus: stringToArray(z.number()),
    category: stringToArray(z.string()),
    customer: z.string(),
  })
  .partial();
export type JobsProductionFilter = z.infer<typeof JobsProductionFilterSchema>;
