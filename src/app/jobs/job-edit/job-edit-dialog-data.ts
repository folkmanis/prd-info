import { Observable } from 'rxjs';
import { JobBase } from 'src/app/interfaces';

export interface JobEditDialogData {
    job?: Partial<JobBase>;
    jobCreateFn?: (job: Partial<JobBase>) => Observable<number>;
}
