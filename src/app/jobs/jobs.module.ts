import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { ProductsService, CustomersService } from './services';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PlateJobModule } from './plate-job/plate-job.module';
import { HTTP_INTERCEPTORS, HttpCacheService } from '../library/http';


@NgModule({
  declarations: [JobsComponent, MainMenuComponent],
  imports: [
    CommonModule,
    LibraryModule,
    PlateJobModule,
    JobsRoutingModule,
  ],
  providers: [
    ProductsService,
    CustomersService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpCacheService },
  ],
})
export class JobsModule { }
