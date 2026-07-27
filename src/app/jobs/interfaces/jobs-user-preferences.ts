import { isoDatetimeToDate } from 'src/app/library';
import { z } from 'zod';
import { JobFilterSchema } from './job-query-filter';

export const SavedJobsProductionFilterSchema = z
  .object({
    sort: z.string(),
    fromDate: isoDatetimeToDate,
    toDate: isoDatetimeToDate,
    jobStatus: z.array(z.number()),
    category: z.array(z.string()),
    customer: z.string(),
  })
  .partial();
export type SavedJobsProductionFilter = z.infer<typeof SavedJobsProductionFilterSchema>;

export const QuickCreateJobSchema = z
  .object({
    customerName: z.string(),
    productName: z.string(),
  })
  .default({
    customerName: '',
    productName: '',
  });
export type QuickCreateJob = z.infer<typeof QuickCreateJobSchema>;

export const GmailUserSettings = z.object({
  activeLabelId: z.array(z.string()).default(['CATEGORY_PERSONAL']),
});
export type GmailUserSettings = z.infer<typeof GmailUserSettings>;

export const SavedJobFilterSchema = z
  .object({
    ...JobFilterSchema.shape,
    invoice: z.boolean(),
    jobStatus: z.array(z.number()).default([10, 20]),
    jobsId: z.array(z.number()),
    unwindProducts: z.boolean(),
    start: z.number().int().nonnegative(),
    limit: z.number().int().nonnegative(),
  })
  .partial();
export type SavedJobFilter = z.output<typeof SavedJobFilterSchema>;

export const JobsUserPreferences = z.object({
  jobsProductionQuery: SavedJobsProductionFilterSchema,
  gmail: GmailUserSettings,
  quickCreateJob: QuickCreateJobSchema,
  jobListFilter: SavedJobFilterSchema.default({}),
});
export type JobsUserPreferences = z.infer<typeof JobsUserPreferences>;

export function defaultJobsUserPreferences(): JobsUserPreferences {
  return {
    jobsProductionQuery: {
      sort: 'name,1',
    },
    gmail: {
      activeLabelId: ['CATEGORY_PERSONAL'],
    },
    quickCreateJob: {
      customerName: '',
      productName: '',
    },
    jobListFilter: {},
  };
}
