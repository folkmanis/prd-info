import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { HttpCacheService } from '../library/http';


@NgModule({
  declarations: [JobsComponent],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpCacheService, multi: true },
  ]
})
export class JobsModule { }
