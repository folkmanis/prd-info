import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';



@NgModule({
  declarations: [
    FileExplorerComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
  ],
  exports: [
    FileExplorerComponent,
  ]
})
export class FilesystemModule { }
