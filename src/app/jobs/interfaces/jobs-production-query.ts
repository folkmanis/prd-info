import { Expose, Type, Transform } from 'class-transformer';
import { formatISO } from 'date-fns';

export interface JobsProductionQuery {
    start: number;
    limit: number;
    sort?: string;
    fromDate?: Date;
    toDate?: Date;
    jobStatus?: number[];
    category?: string[];
};


export class JobsProductionFilter implements Omit<JobsProductionQuery, 'sort' | 'limit' | 'start'> {

    @Transform(
        ({ value }) => value && formatISO(value, { representation: 'date' }),
        { toPlainOnly: true }
    )
    fromDate?: Date;

    @Transform(
        ({ value }) => value && formatISO(value, { representation: 'date' }),
        { toPlainOnly: true }
    )
    toDate?: Date;

    @Transform(
        ({ value }) => value?.length ? value : undefined,
        { toClassOnly: true }
    )
    @Transform(
        ({ value }) => value?.join(','),
        { toPlainOnly: true }
    )
    jobStatus?: number[];

    @Transform(
        ({ value }) => value?.length ? value : undefined,
        { toClassOnly: true }
    )
    @Transform(
        ({ value }) => value?.join(','),
        { toPlainOnly: true }
    )
    category?: string[];

}