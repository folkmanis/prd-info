import { Expose, Type, Transform } from 'class-transformer';
import { formatISO } from 'date-fns';

export type JobsProductionSortQuery = JobsProductionFilter & {
    sort?: [string, 1 | -1 | undefined];
};


export class JobsProductionFilter {

    start = 0;
    limit = 100;

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
    jobStatus?: number[];

    @Transform(
        ({ value }) => value?.length ? value : undefined,
        { toClassOnly: true }
    )
    category?: string[];

}