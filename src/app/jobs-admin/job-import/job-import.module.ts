import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';

import { JobImportRoutingModule } from './job-import-routing.module';
import { JobImportService } from './services/job-import.service';
import { JobImportComponent } from './job-import.component';



@NgModule({
  declarations: [
    JobImportComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    JobImportRoutingModule,
  ],
  providers: [
    JobImportService
  ]
})
export class JobImportModule { }
