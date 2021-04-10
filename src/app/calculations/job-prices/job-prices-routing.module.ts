import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobPricesComponent } from './job-prices.component';
import { JobPricesTableComponent } from './job-prices-table/job-prices-table.component';


const routes: Routes = [
  {
    path: 'job-prices',
    component: JobPricesComponent,
    children: [
      {
        path: ':customer',
        component: JobPricesTableComponent,
      },
      {
        path: '',
        redirectTo: 'all'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobPricesRoutingModule { }
