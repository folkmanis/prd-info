import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { ReproJobsComponent } from './repro-jobs/repro-jobs.component';

const routes: Routes = [
  {
    path: 'repro',
    component: ReproJobsComponent,
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
