import { Job, JobPartial } from './job';
import { JobProduct } from './job-product';

export type JobUnwinded = Job & {
  products: JobProduct | null;
  productsIdx: number | null;
};

export type JobUnwindedPartial = JobPartial & {
  products: JobProduct | null;
  productsIdx: number | null;
};
