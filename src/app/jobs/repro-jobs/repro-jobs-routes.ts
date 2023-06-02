import { Route } from '@angular/router';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { canJobDeactivate } from './repro-job-edit/can-job-deactivate.guard';
import { resolveReproJob } from './services/repro-job-resolver';
import { newReproJob } from './services/new-repro-job.resolver';
import { JobListComponent } from './job-list/job-list.component';
import { appendJobStatus } from './services/job-list.guard';

export default [
    {
        path: 'new',
        component: ReproJobEditComponent,
        resolve: {
            job: newReproJob,
        },
        canDeactivate: [canJobDeactivate]
    },
    {
        path: ':jobId',
        component: ReproJobEditComponent,
        resolve: {
            job: resolveReproJob,
        },
        canDeactivate: [canJobDeactivate]
    },
    {
        path: '',
        component: JobListComponent,
        pathMatch: 'full',
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        canActivate: [appendJobStatus],
    },
    {
        path: '**',
        redirectTo: '',
    }

] as Route[];