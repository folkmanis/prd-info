import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { JobListComponent } from './job-list/job-list.component';
import { PlateInvoiceComponent } from './plate-invoice/plate-invoice.component';
import { InvoiceEditorComponent } from './plate-invoice/invoice-editor/invoice-editor.component';
import { NewInvoiceComponent } from './plate-invoice/new-invoice/new-invoice.component';
import { InvoicesListComponent } from './plate-invoice/invoices-list/invoices-list.component';

const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
    children: [
      {
        path: '',
        component: MainMenuComponent,
        pathMatch: 'full',
        children: [
          {
            path: '',
            component: JobListComponent,
          },
        ]
      },
      {
        path: 'new',
        redirectTo: '/jobs;id=new',
      },
      {
        path: 'plate-invoice',
        component: PlateInvoiceComponent,
        children: [
          {
            path: 'new-invoice',
            component: NewInvoiceComponent,
          },
          {
            path: 'invoice',
            component: InvoiceEditorComponent,
          },
          {
            path: '',
            component: InvoicesListComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
