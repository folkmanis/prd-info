import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewInvoiceComponent } from './new-invoice.component';
import { NewInvoiceJobsResolverService } from './services/new-invoice-jobs-resolver.service';

const routes: Routes = [
  {
    path: 'new-invoice',
    component: NewInvoiceComponent,
    resolve: {
      jobs: NewInvoiceJobsResolverService,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewInvoiceRoutingModule { }
