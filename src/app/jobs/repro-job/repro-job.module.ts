import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ReproJobListComponent } from './repro-job-list/repro-job-list.component';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { ReproJobResolverService } from './services/repro-job-resolver.service';
import { LibraryModule } from 'src/app/library/library.module';
import { JobFilterComponent } from './side-panel/job-filter/job-filter.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { UploadProgressComponent } from './side-panel/upload-progress/upload-progress.component';
import { JobListComponent } from './repro-job-list/job-list/job-list.component';
import { CustomerInputComponent } from './repro-job-edit/customer-input/customer-input.component';
import { FolderPathComponent } from './repro-job-edit/folder-path/folder-path.component';
import { ReproProductsEditorComponent } from './repro-job-edit/repro-products-editor/repro-products-editor.component';
import { ProductAutocompleteComponent } from './repro-job-edit/repro-products-editor/product-autocomplete/product-autocomplete.component';

@NgModule({
  declarations: [
    ReproJobListComponent, 
    JobFilterComponent,
    ReproJobEditComponent,
    SidePanelComponent,
    UploadProgressComponent,
    JobListComponent,
    CustomerInputComponent,
    FolderPathComponent,
    ReproProductsEditorComponent,
    ProductAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    LibraryModule,
    SimpleFormModule.forChildren({
      path: 'repro',
      resolver: ReproJobResolverService,
      listComponent: ReproJobListComponent,
      editorComponent: ReproJobEditComponent,
    })
  ]
})
export class ReproJobModule { }
