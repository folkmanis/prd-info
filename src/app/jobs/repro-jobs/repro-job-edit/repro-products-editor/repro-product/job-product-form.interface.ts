import { FormControl, FormGroup } from '@angular/forms';
import { JobProduct } from 'src/app/jobs/interfaces';

export type JobProductForm = FormGroup<{
  [key in keyof JobProduct]-?: FormControl<JobProduct[key]>
}>;
