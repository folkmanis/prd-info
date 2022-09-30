import { Type, Transform, Expose } from 'class-transformer';


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

export class GmailUserSettings {

    @Expose()
    activeLabelId: string[] = ['CATEGORY_PERSONAL'];

}


export class JobsUserPreferences {

    @Expose()
    @Type(() => SavedJobsProductionQuery)
    jobsProductionQuery: SavedJobsProductionQuery = new SavedJobsProductionQuery();

    @Expose()
    @Type(() => GmailUserSettings)
    gmail: GmailUserSettings = new GmailUserSettings();
}