import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from '../library/library.module';
import { JobEditModule } from './job-edit/job-edit.module';
import { JobListModule } from './job-list/job-list.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { PlateInvoiceModule } from './plate-invoice/plate-invoice.module';
import { ReproJobModule } from './repro-job/repro-job.module';


PdfMakeWrapper.setFonts(pdfFonts);


@NgModule({
  declarations: [
    JobsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    JobsRoutingModule,
    PlateInvoiceModule,
    JobEditModule,
    ReproJobModule,
    JobListModule,
  ],
  providers: [
  ],
})
export class JobsModule { }
