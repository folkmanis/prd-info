import { z } from 'zod';

export const jobsProductionQuerySchema = z.object({
  start: z.number(),
  limit: z.number(),
  sort: z.string(),
  fromDate: z.date().nullable(),
  toDate: z.date().nullable(),
  jobStatus: z.array(z.number()),
  category: z.array(z.string()),
  customer: z.string().nullable(),
});
export type JobsProductionQuery = z.infer<typeof jobsProductionQuerySchema>;

export const jobsProductionFilterQuerySchema = jobsProductionQuerySchema.omit({
  start: true,
  limit: true,
  sort: true,
});
export type JobsProductionFilterQuery = z.infer<typeof jobsProductionFilterQuerySchema>;
