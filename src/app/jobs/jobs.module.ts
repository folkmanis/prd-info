import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from '../library/library.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { ReproJobsModule } from './repro-jobs/repro-jobs.module';


@NgModule({
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    ReproJobsModule,
    JobsRoutingModule,
  ],
})
export class JobsModule { }
