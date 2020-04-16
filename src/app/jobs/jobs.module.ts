import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { HTTP_INTERCEPTORS, HttpCacheService } from '../library/http';


@NgModule({
  declarations: [JobsComponent],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpCacheService },
  ]
})
export class JobsModule { }
