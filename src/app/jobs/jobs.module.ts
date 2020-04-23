import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { ProductsService, CustomersService, JobService } from './services';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
// import { PlateJobModule } from './plate-job/plate-job.module';
import { HTTP_INTERCEPTORS, CacheInterceptorService } from '../library/http';
import { JobListComponent } from './job-list/job-list.component';
import { PlateJobComponent } from './plate-job/plate-job.component';
import { PlateJobEditorComponent } from './plate-job/plate-job-editor/plate-job-editor.component';
import { ProductsEditorComponent } from './plate-job/products-editor/products-editor.component';

@NgModule({
  declarations: [
    JobsComponent,
    MainMenuComponent,
    JobListComponent,
    PlateJobComponent,
    PlateJobEditorComponent,
    ProductsEditorComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    // PlateJobModule,
    JobsRoutingModule,
  ],
  providers: [
    ProductsService,
    CustomersService,
    JobService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true },
  ],
})
export class JobsModule { }
