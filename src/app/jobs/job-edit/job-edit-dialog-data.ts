import { Observable } from 'rxjs';
import { Job } from 'src/app/interfaces';

export interface JobEditDialogData {
    job?: Partial<Job>;
    jobCreateFn?: (job: Partial<Job>) => Observable<number>;
}
