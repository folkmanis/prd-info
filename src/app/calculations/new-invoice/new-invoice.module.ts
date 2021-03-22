import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { CalculationsLibraryModule } from '../calculations-library/calculations-library.module';
import { NewInvoiceRoutingModule } from './new-invoice-routing.module';

import { NewInvoiceComponent } from './new-invoice.component';
import { SelectionTotalsComponent } from './selection-totals/selection-totals.component';
import { JobsWithoutInvoicesComponent } from './jobs-without-invoices/jobs-without-invoices.component';


@NgModule({
  declarations: [
    NewInvoiceComponent,
    SelectionTotalsComponent,
    JobsWithoutInvoicesComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    CalculationsLibraryModule,
    NewInvoiceRoutingModule,
  ]
})
export class NewInvoiceModule { }
