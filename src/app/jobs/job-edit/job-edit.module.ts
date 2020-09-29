import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { JobDialogComponent } from './job-dialog.component';
import { PlateJobEditorComponent } from './plate-job-editor/plate-job-editor.component';
import { ProductAutocompleteComponent } from './products-editor/product-autocomplete/product-autocomplete.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { FolderPathComponent } from './folder-path/folder-path.component';


import { JobEditDialogService } from './services/job-edit-dialog.service';


@NgModule({
  declarations: [
    PlateJobEditorComponent,
    ProductsEditorComponent,
    JobDialogComponent,
    ProductAutocompleteComponent,
    FolderPathComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
  ],
  providers: [
    JobEditDialogService,
  ]

})
export class JobEditModule { }
