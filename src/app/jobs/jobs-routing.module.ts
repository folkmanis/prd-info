import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PlateJobComponent } from './plate-job/plate-job.component';
import { PlateInvoiceComponent } from './plate-invoice/plate-invoice.component';
import { InvoiceEditorComponent } from './plate-invoice/invoice-editor/invoice-editor.component';
import { NewInvoiceComponent } from './plate-invoice/new-invoice/new-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: JobsComponent,
    children: [
      {
        path: '',
        component: MainMenuComponent,
      },
      {
        path: 'plate-job',
        component: PlateJobComponent,
      },
      {
        path: 'plate-invoice',
        component: PlateInvoiceComponent,
        children: [
          {
            path: 'new-invoice',
            component: NewInvoiceComponent,
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
