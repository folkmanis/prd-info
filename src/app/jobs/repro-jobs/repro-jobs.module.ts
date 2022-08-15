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
import { ProductAutocompleteComponent } from './repro-job-edit/repro-products-editor/product-autocomplete/product-autocomplete.component';
import { ProductControlDirective } from './repro-job-edit/repro-products-editor/repro-product/product-control.directive';
import { ReproProductsEditorComponent } from './repro-job-edit/repro-products-editor/repro-products-editor.component';
import { ReproJobsComponent } from './repro-jobs.component';
import { JobFilterComponent } from './job-filter/job-filter.component';
import { UploadProgressComponent } from './upload-progress/upload-progress.component';
import { JobFilterSummaryComponent } from './job-filter/job-filter-summary/job-filter-summary.component';
import { ProductsSummaryComponent } from './products-summary/products-summary.component';
import { ReproProductComponent } from './repro-job-edit/repro-products-editor/repro-product/repro-product.component';
import { JobFormComponent } from './repro-job-edit/job-form/job-form.component';
import { SnackbarMessageComponent } from './snackbar-message/snackbar-message.component';
import { NewJobButtonComponent } from './job-list/new-job-button/new-job-button.component';
import { ActiveProductDirective } from './job-list/active-product.directive';
import { DropFolderComponent } from './repro-job-edit/drop-folder/drop-folder.component';


@NgModule({
  declarations: [
    ReproJobsComponent,
    JobFilterComponent,
    ReproJobEditComponent,
    UploadProgressComponent,
    JobListComponent,
    CustomerInputComponent,
    FolderPathComponent,
    ReproProductsEditorComponent,
    ProductAutocompleteComponent,
    ProductControlDirective,
    KeyPressDirective,
    JobFilterSummaryComponent,
    ProductsSummaryComponent,
    ReproProductComponent,
    JobFormComponent,
    SnackbarMessageComponent,
    NewJobButtonComponent,
    ActiveProductDirective,
    DropFolderComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    LibraryModule,
    RouterModule,
  ]
})
export class ReproJobsModule { }
