import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { JobListComponent } from './job-list/job-list.component';
import { canJobDeactivate } from './repro-job-edit/can-job-deactivate.guard';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { jobFilterResolver } from './services/job-filter.resolver';
import { newReproJob } from './services/new-repro-job.resolver';
import { resolveReproJob } from './services/repro-job-resolver';
import { UploadRefService } from './services/upload-ref.service';

export default [
  {
    path: 'new',
    component: ReproJobEditComponent,
    resolve: {
      job: newReproJob,
      uploadRef: () => inject(UploadRefService).retrieveUploadRef(),
    },
    canDeactivate: [canJobDeactivate],
    data: {
      jobId: null,
    },
    title: 'Jauns repro darbs',
  },
  {
    path: ':jobId',
    component: ReproJobEditComponent,
    resolve: {
      job: resolveReproJob,
    },
    canDeactivate: [canJobDeactivate],
    title: (route) => `Repro darbs ${route.paramMap.get('jobId')}`,
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
