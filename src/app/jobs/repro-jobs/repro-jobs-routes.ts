import { Route } from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';
import { JobViewComponent } from './job-view/job-view.component';
import { canJobDeactivate } from './repro-job-edit/can-job-deactivate.guard';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { jobFilterResolver } from './services/job-filter.resolver';
import { newReproJob } from './services/new-repro-job.resolver';
import { resolveReproJob } from './services/repro-job-resolver';

export default [
  {
    path: 'new',
    component: ReproJobEditComponent,
    resolve: {
      job: newReproJob,
    },
    canDeactivate: [canJobDeactivate],
    data: {
      jobId: null,
    },
    title: 'Jauns repro darbs',
  },
  {
    path: ':jobId',
    resolve: {
      job: resolveReproJob,
    },
    title: (route) => `Repro darbs ${route.paramMap.get('jobId')}`,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'edit',
        component: ReproJobEditComponent,
        canDeactivate: [canJobDeactivate],
      },
      {
        path: '',
        component: JobViewComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '',
    component: JobListComponent,
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      filter: jobFilterResolver,
    },
    title: 'Repro darbu saraksts',
  },
  {
    path: '**',
    redirectTo: '',
  },
] as Route[];
