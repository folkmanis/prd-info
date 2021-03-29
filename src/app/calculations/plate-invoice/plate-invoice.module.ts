import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateInvoiceRoutingModule } from './plate-invoice-routing.module';
import { LibraryModule } from 'src/app/library/library.module';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { CalculationsLibraryModule } from '../calculations-library/calculations-library.module';

import { PlateInvoiceComponent } from './plate-invoice.component';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoiceProductsComponent } from './invoice-editor/invoice-products/invoice-products.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    PlateInvoiceComponent,
    InvoiceEditorComponent,
    InvoicesListComponent,
    InvoiceProductsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    CalculationsLibraryModule,
    MaterialLibraryModule,
    PlateInvoiceRoutingModule,
  ]
})
export class PlateInvoiceModule { }