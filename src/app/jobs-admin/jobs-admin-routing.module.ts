import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsAdminComponent } from './jobs-admin.component';

const routes: Routes = [{ path: '', component: JobsAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsAdminRoutingModule { }
