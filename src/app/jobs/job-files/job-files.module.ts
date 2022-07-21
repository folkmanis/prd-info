import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { JobFilesComponent } from './job-files.component';
import { FilesystemModule } from 'src/app/filesystem/filesystem.module';



@NgModule({
  declarations: [
    JobFilesComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    FilesystemModule,
  ]
})
export class JobFilesModule { }
