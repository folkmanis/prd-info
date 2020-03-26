import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';


@NgModule({
  declarations: [JobsComponent],
  imports: [
    CommonModule,
    LibraryModule,
    JobsRoutingModule
  ]
})
export class JobsModule { }
