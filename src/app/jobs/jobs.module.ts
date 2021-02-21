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

import { SidePanelComponent } from './side-panel/side-panel.component';

import { UploadProgressComponent } from './side-panel/upload-progress/upload-progress.component';

PdfMakeWrapper.setFonts(pdfFonts);
import { MaterialLibraryModule } from 'src/app/library/material-library.module';


@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    JobFilterComponent,
    SidePanelComponent,
    UploadProgressComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    JobsRoutingModule,
    PlateInvoiceModule,
    JobEditModule,
  ],
  providers: [
  ],
})
export class JobsModule { }
