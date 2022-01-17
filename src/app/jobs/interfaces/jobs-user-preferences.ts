import { Type, Transform, Expose } from 'class-transformer';
import { ProductsFormData } from '../products-production/filter/filter-form';

export class SavedJobsProductionQuery {

    @Expose()
    sort?: string;

    @Expose()
    fromDate?: string;

    @Expose()
    toDate?: string;

    @Expose()
    jobStatus?: number[];

    @Expose()
    category?: string[];

}


export class JobsUserPreferences {

    @Expose()
    @Type(() => SavedJobsProductionQuery)
    jobsProductionQuery: SavedJobsProductionQuery = new SavedJobsProductionQuery();
}