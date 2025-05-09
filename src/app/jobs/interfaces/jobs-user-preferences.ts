import { z } from 'zod';

export const SavedJobsProductionQuery = z.object({
  sort: z.string(),
  fromDate: z.string().nullable(),
  toDate: z.string().nullable(),
  jobStatus: z.number().array().nullable(),
  category: z.string().array().nullable(),
});
export type SavedJobsProductionQuery = z.infer<typeof SavedJobsProductionQuery>;

export const GmailUserSettings = z.object({
  activeLabelId: z.string().array().default(['CATEGORY_PERSONAL']),
});
export type GmailUserSettings = z.infer<typeof GmailUserSettings>;

export const JobsUserPreferences = z.object({
  jobsProductionQuery: SavedJobsProductionQuery,
  gmail: GmailUserSettings,
});
export type JobsUserPreferences = z.infer<typeof JobsUserPreferences>;

export const DEFAULT_JOBS_USER_PREFERENCES: JobsUserPreferences = {
  jobsProductionQuery: {
    sort: 'name,1',
    fromDate: null,
    toDate: null,
    jobStatus: null,
    category: null,
  },
  gmail: {
    activeLabelId: ['CATEGORY_PERSONAL'],
  },
};
