export interface SavedJobsProductionQuery {

    sort?: string;
    fromDate?: string;
    toDate?: string;
    jobStatus?: number[];
    category?: string[];

}

export interface GmailUserSettings {
    activeLabelId: string[];
}


export interface JobsUserPreferences {
    jobsProductionQuery: SavedJobsProductionQuery;
    gmail: GmailUserSettings;
}

export const DEFAULT_JOBS_USER_PREFERENCES: JobsUserPreferences = {
    jobsProductionQuery: {
        sort: 'name,1',
    },
    gmail: {
        activeLabelId: ['CATEGORY_PERSONAL'],
    }
};