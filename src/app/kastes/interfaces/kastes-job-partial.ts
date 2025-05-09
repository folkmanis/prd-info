import { KastesJob } from 'src/app/jobs';
import { z } from 'zod';

export const KastesJobPartial = KastesJob.pick({
  jobId: true,
  customer: true,
  name: true,
  customerJobId: true,
  receivedDate: true,
  dueDate: true,
  products: true,
  invoiceId: true,
  jobStatus: true,
}).extend({
  custCode: z.string(),
  production: KastesJob.shape.production.pick({ category: true }),
});
export type KastesJobPartial = z.infer<typeof KastesJobPartial>;
