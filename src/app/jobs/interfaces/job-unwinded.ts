import { Job, JobPartial } from './job';
import { JobProduct } from './job-product';
import { z } from 'zod';

export const UnwindedIndex = z.object({
  products: JobProduct,
  productsIdx: z.number(),
});

export const JobUnwinded = z.object({ ...Job.shape, ...UnwindedIndex.shape });
export type JobUnwinded = z.infer<typeof JobUnwinded>;

export const JobUnwindedPartial = z.object({ ...JobPartial.shape, ...UnwindedIndex.shape });
export type JobUnwindedPartial = z.infer<typeof JobUnwindedPartial>;
