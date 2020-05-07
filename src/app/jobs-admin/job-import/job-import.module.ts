import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule, ParserService } from 'src/app/library';

import { JobImportRoutingModule } from './job-import-routing.module';
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
  ]
})
export class JobImportModule { }
