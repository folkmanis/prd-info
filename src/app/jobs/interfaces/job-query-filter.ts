import { isoDatetimeToDate, stringToArray, stringToInt } from 'src/app/library';
import { z } from 'zod';
import { JOB_CATEGORIES } from './job-categories';

export const JobFilterSchema = z
  .object({
    fromDate: isoDatetimeToDate,
    toDate: isoDatetimeToDate,
    customer: z.string(),
    name: z.string(),
    invoice: z.stringbool({ truthy: ['1'], falsy: ['0'] }),
    jobStatus: stringToArray(z.number()).default([]),
    jobsId: stringToArray(z.number()),
    productsName: z.string(),
    category: JOB_CATEGORIES,
    unwindProducts: z.stringbool({ truthy: ['1'], falsy: ['0'] }),
    start: stringToInt,
    limit: stringToInt,
  })
  .partial();
export type JobFilter = z.infer<typeof JobFilterSchema>;
