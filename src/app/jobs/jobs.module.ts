import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { LibraryModule } from '../library/library.module';
import { JobDialogComponent } from './job-edit/job-dialog.component';
import { PlateJobEditorComponent } from './job-edit/plate-job-editor/plate-job-editor.component';
import { ProductAutocompleteComponent } from './job-edit/products-editor/product-autocomplete/product-autocomplete.component';
import { ProductsEditorComponent } from './job-edit/products-editor/products-editor.component';
import { JobFilterComponent } from './job-list/job-filter/job-filter.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PlateInvoiceModule } from './plate-invoice/plate-invoice.module';
import { InvoicesService } from './services/invoices.service';
import { JobEditDialogService } from './services/job-edit-dialog.service';
import { CustomerInputDialogComponent } from './side-panel/customer-input-dialog/customer-input-dialog.component';
import { SidePanelComponent } from './side-panel/side-panel.component';


PdfMakeWrapper.setFonts(pdfFonts);


@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    PlateJobEditorComponent,
    ProductsEditorComponent,
    JobFilterComponent,
    JobDialogComponent,
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
