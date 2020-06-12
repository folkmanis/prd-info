import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Job } from 'src/app/interfaces';

export interface JobEditDialogData {
    jobForm: FormGroup;
    job?: Partial<Job>;
    jobCreateFn?: (job: Partial<Job>) => Observable<number>;
}
