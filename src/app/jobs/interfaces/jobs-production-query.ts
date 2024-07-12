export interface JobsProductionQuery {
  start: number;
  limit: number;
  sort?: string;
  fromDate?: string;
  toDate?: string;
  jobStatus?: number[];
  category?: string[];
}

export type JobsProductionFilterQuery = Omit<JobsProductionQuery, 'start' | 'limit' | 'sort'>;
