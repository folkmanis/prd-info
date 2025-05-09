import { Job, JobPartial } from './job';
import { JobProduct } from './job-product';
import { z } from 'zod';

export const UnwindedIndex = z.object({
  products: JobProduct,
  productsIdx: z.number(),
});

export const JobUnwinded = Job.merge(UnwindedIndex);
export type JobUnwinded = z.infer<typeof JobUnwinded>;

export const JobUnwindedPartial = JobPartial.merge(UnwindedIndex);
export type JobUnwindedPartial = z.infer<typeof JobUnwindedPartial>;
