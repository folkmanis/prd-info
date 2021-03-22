import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from '../library/library.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { ReproJobModule } from './repro-job/repro-job.module';




@NgModule({
  declarations: [
    JobsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    JobsRoutingModule,
    ReproJobModule,
  ],
})
export class JobsModule { }
