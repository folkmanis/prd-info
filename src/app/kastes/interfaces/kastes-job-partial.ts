import { KastesJob, Production } from 'src/app/interfaces';

export type KastesJobPartial = Pick<KastesJob,
    'jobId' | 'customer' | 'name' | 'customerJobId' | 'receivedDate' | 'dueDate' | 'products' | 'invoiceId' | 'jobStatus'
> & {
    custCode: string;
    production: Pick<Production, 'category'>;
};
