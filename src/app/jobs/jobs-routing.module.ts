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
  { path: 'products-production', loadChildren: () => import('./products-production/products-production.module').then(m => m.ProductsProductionModule) },
  { path: 'gmail', loadChildren: () => import('./gmail/gmail.module').then(m => m.GmailModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
