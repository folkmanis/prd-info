import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { LibraryModule } from '../library/library.module';

import { JobFilterComponent } from './job-list/job-filter/job-filter.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { PlateInvoiceModule } from './plate-invoice/plate-invoice.module';
import { JobEditModule } from './job-edit/job-edit.module';

import { CustomerInputDialogComponent } from './side-panel/customer-input-dialog/customer-input-dialog.component';
import { SidePanelComponent } from './side-panel/side-panel.component';

import { InvoicesService } from './services/invoices.service';
import { FileUploadService } from './services/file-upload.service';
import { UploadProgressComponent } from './side-panel/upload-progress/upload-progress.component';

PdfMakeWrapper.setFonts(pdfFonts);


@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    JobFilterComponent,
    SidePanelComponent,
    CustomerInputDialogComponent,
    UploadProgressComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule,
    PlateInvoiceModule,
    JobEditModule,
  ],
  providers: [
    InvoicesService,
    FileUploadService,
  ],
})
export class JobsModule { }
