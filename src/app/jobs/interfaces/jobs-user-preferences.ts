import { z } from 'zod';
import { JobFilterSchema } from './job-query-filter';

export const SavedJobsProductionQuery = z.object({
  sort: z.string().default('name,1'),
  fromDate: z.coerce.date().nullable(),
  toDate: z.coerce.date().nullable(),
  jobStatus: z.array(z.number()).default([10, 20]),
  category: z.array(z.string()).default(['repro']),
  customer: z.string().nullable().default(null),
});
export type SavedJobsProductionQuery = z.infer<typeof SavedJobsProductionQuery>;

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

export const JobsUserPreferences = z.object({
  jobsProductionQuery: SavedJobsProductionQuery,
  gmail: GmailUserSettings,
  quickCreateJob: QuickCreateJobSchema,
  jobListFilter: JobFilterSchema.default({}),
});
export type JobsUserPreferences = z.infer<typeof JobsUserPreferences>;

export function defaultJobsUserPreferences(): JobsUserPreferences {
  return {
    jobsProductionQuery: {
      sort: 'name,1',
      fromDate: new Date(),
      toDate: new Date(),
      jobStatus: [10, 20],
      category: ['repro'],
      customer: null,
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
