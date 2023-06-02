import { JobProduct, JobUnwindedPartial } from 'src/app/jobs';

const JOB_COLUMNS = ['jobId', 'custCode', 'name'] as const;
const PRODUCT_COLUMNS = ['name', 'price', 'count', 'units', 'total'] as const;
const PREFIX = 'products';
type Prefix<P extends string, T> = { [K in keyof T as `${P}.${string & K}`]: T[K] };


export type JobWithUpdate = JobUnwindedPartial & {
    'products.priceUpdate'?: number;
};

export type JobData =
    Pick<JobWithUpdate, (typeof JOB_COLUMNS[number]) | 'products' | 'productsIdx' | 'customer'>
    & Prefix<typeof PREFIX, Pick<JobProduct & { total: number; priceUpdate?: number; }, typeof PRODUCT_COLUMNS[number]>>;

export const COLUMNS = ['selection', ...JOB_COLUMNS, ...PRODUCT_COLUMNS.map(col => `${PREFIX}.${col}`)];
export const COLUMNS_SMALL = ['selection', 'jobId', 'custCode', ...['name', 'price'].map(col => `${PREFIX}.${col}`), 'edit'];
