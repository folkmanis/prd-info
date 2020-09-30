import { JobBase } from 'src/app/interfaces';

export interface JobEditDialogResult {
    job: Partial<JobBase>;
    files?: File[];
}
