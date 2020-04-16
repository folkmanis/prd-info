import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateJobRoutingModule } from './plate-job-routing.module';
import { PlateJobComponent } from './plate-job.component';
import { LibraryModule } from 'src/app/library/library.module';


@NgModule({
  declarations: [PlateJobComponent],
  imports: [
    CommonModule,
    LibraryModule,
    PlateJobRoutingModule,
  ]
})
export class PlateJobModule { }
