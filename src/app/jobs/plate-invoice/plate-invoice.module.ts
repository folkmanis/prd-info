import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateInvoiceRoutingModule } from './plate-invoice-routing.module';
import { LibraryModule } from 'src/app/library/library.module';

import { PlateInvoiceComponent } from './plate-invoice.component';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor.component';
import { JobSelectionTableComponent } from './new-invoice/job-selection-table/job-selection-table.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { SelectionTotalsComponent } from './new-invoice/selection-totals/selection-totals.component';
import { JobsWithoutInvoicesComponent } from './jobs-without-invoices/jobs-without-invoices.component';


@NgModule({
  declarations: [
    PlateInvoiceComponent,
    InvoiceEditorComponent,
    JobSelectionTableComponent,
    NewInvoiceComponent,
    InvoicesListComponent,
    SelectionTotalsComponent,
    JobsWithoutInvoicesComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    PlateInvoiceRoutingModule,
  ]
})
export class PlateInvoiceModule { }
