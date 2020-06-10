import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LibraryModule } from '../library/library.module';
import { PdfMakeWrapper } from 'pdfmake-wrapper';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CacheInterceptorService } from '../library/http';
import { JobListComponent } from './job-list/job-list.component';
import { PlateJobComponent } from './plate-job/plate-job.component';
import { PlateJobEditorComponent } from './plate-job/plate-job-editor/plate-job-editor.component';
import { ProductsEditorComponent } from './plate-job/products-editor/products-editor.component';
import { PlateInvoiceComponent } from './plate-invoice/plate-invoice.component';
import { InvoiceEditorComponent } from './plate-invoice/invoice-editor/invoice-editor.component';
import { JobSelectionTableComponent } from './plate-invoice/job-selection-table/job-selection-table.component';
import { NewInvoiceComponent } from './plate-invoice/new-invoice/new-invoice.component';
import { InvoicesListComponent } from './plate-invoice/invoices-list/invoices-list.component';
import { JobDialogComponent } from './job-edit/job-dialog/job-dialog.component';
import { JobService } from './services/job.service';
import { InvoicesService } from './services/invoices.service';
import { JobEditDialogService } from './services/job-edit-dialog.service';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { JobFilterComponent } from './job-list/job-filter/job-filter.component';
PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    PlateJobComponent,
    PlateJobEditorComponent,
    ProductsEditorComponent,
    PlateInvoiceComponent,
    InvoiceEditorComponent,
    JobSelectionTableComponent,
    NewInvoiceComponent,
    InvoicesListComponent,
    JobFilterComponent,
    JobDialogComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule,
  ],
  providers: [
    JobService,
    InvoicesService,
    JobEditDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true },
  ],
})
export class JobsModule { }
