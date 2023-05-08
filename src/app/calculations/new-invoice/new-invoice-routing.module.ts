import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewInvoiceComponent } from './new-invoice.component';
import { resolveNewInvoiceJobs } from './services/new-invoice-jobs-resolver';

const routes: Routes = [
  {
    path: 'new-invoice',
    component: NewInvoiceComponent,
    resolve: {
      jobs: resolveNewInvoiceJobs,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewInvoiceRoutingModule { }
