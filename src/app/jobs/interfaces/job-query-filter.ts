import { ParamMap } from '@angular/router';
import { isoDateToDate, stringToArray, stringToInt } from 'src/app/library';
import { z } from 'zod';
import { JOB_CATEGORIES } from './job-categories';

export const JobFilterSchema = z
  .object({
    fromDate: isoDateToDate,
    toDate: isoDateToDate,
    customer: z.string(),
    name: z.string(),
    invoice: z.stringbool({ truthy: ['1'], falsy: ['0'] }),
    jobStatus: stringToArray(z.number()).default([10, 20]),
    jobsId: stringToArray(z.number()),
    productsName: z.string(),
    category: JOB_CATEGORIES,
    unwindProducts: z.stringbool({ truthy: ['1'], falsy: ['0'] }),
    start: stringToInt,
    limit: stringToInt,
  })
  .partial();
export type JobFilter = z.infer<typeof JobFilterSchema>;

export function queryParamsToJobFilter(queryParams: ParamMap): JobFilter {
  return JobFilterSchema.parse(queryParams);
}

export function jobFilterToRequestQuery(
  filter?: z.infer<typeof JobFilterSchema>,
): z.input<typeof JobFilterSchema> | undefined {
  return JobFilterSchema.optional().encode(filter);
}
