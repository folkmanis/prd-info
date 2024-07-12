import { Route } from '@angular/router';
import { resolveInvoice } from './invoice-resolver';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';

export default [
  {
    path: ':invoiceId',
    component: InvoiceEditorComponent,
    resolve: {
      invoice: resolveInvoice,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    component: InvoicesListComponent,
    pathMatch: 'full',
  },
] as Route[];
