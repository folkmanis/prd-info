import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from '../library/library.module';
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
    ReproJobModule,
  ],
})
export class JobsModule { }
