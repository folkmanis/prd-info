import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlateInvoiceComponent } from './plate-invoice.component';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';

const routes: Routes = [
  {
    path: 'plate-invoice',
    component: PlateInvoiceComponent,
    children: [
      {
        path: ':invoiceId',
        component: InvoiceEditorComponent,
      },
      {
        path: '',
        component: InvoicesListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateInvoiceRoutingModule { }
