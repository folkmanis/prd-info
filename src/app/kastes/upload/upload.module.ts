import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library';
import { KastesCommonModule } from '../common/kastes-common.module';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { SelectFileComponent } from './select-file/select-file.component';
import { DragableDirective, DragDropDirective, FileDropDirective } from './services';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';

@NgModule({
  declarations: [
    UploadComponent,
    UploadAdresesComponent,
    EndDialogComponent,
    FileDropDirective,
    DragDropDirective,
    DragableDirective,
    SelectFileComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    KastesCommonModule,
    UploadRoutingModule,
  ],
})
export class UploadModule { }
