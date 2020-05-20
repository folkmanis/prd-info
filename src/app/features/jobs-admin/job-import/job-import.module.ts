import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule, ParserService } from 'src/app/library';

import { JobImportRoutingModule } from './job-import-routing.module';
import { JobImportComponent } from './job-import.component';
import { ImportNewCustomersComponent } from './import-new-customers/import-new-customers.component';
import { ImportNewPricesComponent } from './import-new-prices/import-new-prices.component';
import { ImportNewJobsComponent } from './import-new-jobs/import-new-jobs.component';

@NgModule({
  declarations: [
    JobImportComponent,
    ImportNewCustomersComponent,
    ImportNewPricesComponent,
    ImportNewJobsComponent
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
