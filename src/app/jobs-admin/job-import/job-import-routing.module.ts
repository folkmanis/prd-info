import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { JobImportComponent } from './job-import.component';

const routes: Routes = [
  {
    path: 'job-import',
    component: JobImportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobImportRoutingModule { }
