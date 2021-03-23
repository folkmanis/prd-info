import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobPricesComponent } from './job-prices.component';

const routes: Routes = [
  {
    path: 'job-prices',
    component: JobPricesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobPricesRoutingModule { }
