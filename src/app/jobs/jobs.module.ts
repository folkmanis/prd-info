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
import { PlateJobEditorComponent } from './job-edit/plate-job-editor/plate-job-editor.component';
import { ProductsEditorComponent } from './job-edit/products-editor/products-editor.component';
import { JobDialogComponent } from './job-edit/job-dialog.component';
import { InvoicesService } from './services/invoices.service';
import { JobEditDialogService } from './services/job-edit-dialog.service';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { JobFilterComponent } from './job-list/job-filter/job-filter.component';
import { ProductForOfDirective } from './job-edit/product-for.directive';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { CustomerInputDialogComponent } from './side-panel/customer-input-dialog/customer-input-dialog.component';
PdfMakeWrapper.setFonts(pdfFonts);

import { PlateInvoiceModule } from './plate-invoice/plate-invoice.module';
import { ProductAutocompleteComponent } from './job-edit/products-editor/product-autocomplete/product-autocomplete.component';

@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    PlateJobEditorComponent,
    ProductsEditorComponent,
    JobFilterComponent,
    JobDialogComponent,
    ProductForOfDirective,
    SidePanelComponent,
    CustomerInputDialogComponent,
    ProductAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule,
    PlateInvoiceModule,
  ],
  providers: [
    InvoicesService,
    JobEditDialogService,
  ],
})
export class JobsModule { }
