export interface JobsProductionQuery {
  start: number;
  limit: number;
  sort: string;
  fromDate: string | null;
  toDate: string | null;
  jobStatus: number[] | null;
  category: string[] | null;
}

export type JobsProductionFilterQuery = Omit<JobsProductionQuery, 'start' | 'limit' | 'sort'>;
