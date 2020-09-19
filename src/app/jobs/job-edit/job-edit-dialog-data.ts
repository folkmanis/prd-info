import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { JobBase } from 'src/app/interfaces';

export interface JobEditDialogData {
    jobForm: IFormGroup<JobBase>;
    job?: Partial<JobBase>;
    jobCreateFn?: (job: Partial<JobBase>) => Observable<number>;
}
