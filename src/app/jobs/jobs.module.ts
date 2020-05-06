import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { HTTP_INTERCEPTORS, CacheInterceptorService } from '../library/http';
import { JobListComponent } from './job-list/job-list.component';
import { PlateJobComponent } from './plate-job/plate-job.component';
import { PlateJobEditorComponent } from './plate-job/plate-job-editor/plate-job-editor.component';
import { ProductsEditorComponent } from './plate-job/products-editor/products-editor.component';
import { PlateInvoiceComponent } from './plate-invoice/plate-invoice.component';
import { InvoiceEditorComponent } from './plate-invoice/invoice-editor/invoice-editor.component';
import { JobSelectionTableComponent } from './plate-invoice/job-selection-table/job-selection-table.component';
import { NewInvoiceComponent } from './plate-invoice/new-invoice/new-invoice.component';
import { ProductsService, CustomersService, JobService, InvoicesService } from './services';
import { InvoicesListComponent } from './plate-invoice/invoices-list/invoices-list.component';

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
  ],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule,
  ],
  providers: [
    ProductsService,
    CustomersService,
    JobService,
    InvoicesService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true },
  ],
})
export class JobsModule { }
