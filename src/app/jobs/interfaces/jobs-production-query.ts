import { z } from 'zod';

export const JobsProductionQuery = z.object({
  start: z.number(),
  limit: z.number(),
  sort: z.string(),
  fromDate: z.string().nullable(),
  toDate: z.string().nullable(),
  jobStatus: z.array(z.number()).nullable(),
  category: z.array(z.string()).nullable(),
});
export type JobsProductionQuery = z.infer<typeof JobsProductionQuery>;

export const JobsProductionFilterQuery = JobsProductionQuery.omit({
  start: true,
  limit: true,
  sort: true,
});
export type JobsProductionFilterQuery = z.infer<typeof JobsProductionFilterQuery>;
