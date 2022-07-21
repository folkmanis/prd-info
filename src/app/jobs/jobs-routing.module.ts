import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { ReproJobsComponent } from './repro-jobs/repro-jobs.component';
import { JobListComponent } from './repro-jobs/job-list/job-list.component';
import { ReproJobEditComponent } from './repro-jobs/repro-job-edit/repro-job-edit.component';
import { ReproJobResolverService } from './repro-jobs/services/repro-job-resolver.service';
import { NewReproJobResolver } from './repro-jobs/services/new-repro-job.resolver';
import { ReproJobEditGuard } from './repro-jobs/repro-job-edit/repro-job-edit.guard';
import { JobFilesComponent } from './job-files/job-files.component';


const routes: Routes = [
  {
    path: 'repro',
    component: ReproJobsComponent,
    children: [
      {
        path: 'new',
        component: ReproJobEditComponent,
        resolve: {
          job: NewReproJobResolver,
        },
        canDeactivate: [ReproJobEditGuard]
      },
      {
        path: ':jobId',
        children: [
          {
            path: '',
            component: ReproJobEditComponent,
            resolve: {
              job: ReproJobResolverService,
            },
            canDeactivate: [ReproJobEditGuard]
          },
          {
            path: 'files',
            component: JobFilesComponent,
          }
        ]
      },
      {
        path: '',
        component: JobListComponent,
      },
    ]
  },
  {
    path: '',
    component: JobsComponent,
  },
  { path: 'products-production', loadChildren: () => import('./products-production/products-production.module').then(m => m.ProductsProductionModule) },
  { path: 'gmail', loadChildren: () => import('./gmail/gmail.module').then(m => m.GmailModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
