import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { JobListComponent } from './repro-jobs/job-list/job-list.component';
import { ReproJobEditComponent } from './repro-jobs/repro-job-edit/repro-job-edit.component';
import { resolveReproJob } from './repro-jobs/services/repro-job-resolver';
import { newReproJob } from './repro-jobs/services/new-repro-job.resolver';
import { canJobDeactivate } from './repro-jobs/repro-job-edit/can-job-deactivate.guard';
import { appendJobStatus } from './repro-jobs/services/job-list.guard';


const routes: Routes = [
  {
    path: 'repro',
    children: [
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
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        canActivate: [appendJobStatus],
      },
    ]
  },
  {
    path: 'products-production',
    loadComponent: () => import('./products-production/products-production.component').then(c => c.ProductsProductionComponent)
  },
  {
    path: 'gmail',
    loadChildren: () => import('./gmail/gmail-routes')
  },
  {
    path: '',
    component: JobsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
