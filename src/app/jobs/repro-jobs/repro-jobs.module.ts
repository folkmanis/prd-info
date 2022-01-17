import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { JobListComponent } from './job-list/job-list.component';
import { CustomerInputComponent } from './repro-job-edit/customer-input/customer-input.component';
import { FolderPathComponent } from './repro-job-edit/folder-path/folder-path.component';
import { KeyPressDirective } from './repro-job-edit/key-press.directive';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { ReproJobFormComponent } from './repro-job-edit/repro-job-form/repro-job-form.component';
import { ProductAutocompleteComponent } from './repro-job-edit/repro-products-editor/product-autocomplete/product-autocomplete.component';
import { ProductControlDirective } from './repro-job-edit/repro-products-editor/product-control.directive';
import { ReproProductsEditorComponent } from './repro-job-edit/repro-products-editor/repro-products-editor.component';
import { ReproJobsComponent } from './repro-jobs.component';
import { JobFilterComponent } from './job-filter/job-filter.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { UploadProgressComponent } from './side-panel/upload-progress/upload-progress.component';
import { JobFilterSummaryComponent } from './job-filter/job-filter-summary/job-filter-summary.component';
import { ProductsSummaryComponent } from './products-summary/products-summary.component';

@NgModule({
  declarations: [
    ReproJobsComponent,
    JobFilterComponent,
    ReproJobEditComponent,
    SidePanelComponent,
    UploadProgressComponent,
    JobListComponent,
    CustomerInputComponent,
    FolderPathComponent,
    ReproProductsEditorComponent,
    ProductAutocompleteComponent,
    ProductControlDirective,
    KeyPressDirective,
    ReproJobFormComponent,
    JobFilterSummaryComponent,
    ProductsSummaryComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    LibraryModule,
    RouterModule,
  ]
})
export class ReproJobsModule { }
