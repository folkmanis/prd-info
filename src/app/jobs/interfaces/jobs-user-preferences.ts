export interface SavedJobsProductionQuery {
  sort: string;
  fromDate: string | null;
  toDate: string | null;
  jobStatus: number[] | null;
  category: string[] | null;
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
    fromDate: null,
    toDate: null,
    jobStatus: null,
    category: null,
  },
  gmail: {
    activeLabelId: ['CATEGORY_PERSONAL'],
  },
};
