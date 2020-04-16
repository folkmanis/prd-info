import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { PlateJobModule } from './plate-job/plate-job.module';


@NgModule({
  declarations: [JobsComponent, MainMenuComponent],
  imports: [
    CommonModule,
    LibraryModule,
    PlateJobModule,
    JobsRoutingModule,
  ]
})
export class JobsModule { }
