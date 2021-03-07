import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { JobListComponent } from './job-list.component';


@NgModule({
  declarations: [
    JobListComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
  ],
  exports:[
    JobListComponent,
  ]
})
export class JobListModule { }
