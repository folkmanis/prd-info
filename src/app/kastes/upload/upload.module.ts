import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../../library/library.module';
import { UploadComponent } from './upload.component';
import { UploadTabulaComponent } from './upload-tabula/upload-tabula.component';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';
import { EditorComponent } from './upload-tabula/editor/editor.component';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { FileDropDirective } from './services/file-drop.directive';
import { DragDropDirective } from './services/drag-drop.directive';
import { DragableDirective } from './services/dragable.directive';
import { TotalValidatorDirective } from './upload-tabula/editor/total-validator.directive';
import { PlusPipePipe } from './upload-tabula/editor/plus-pipe.pipe';

@NgModule({
  declarations: [
    UploadComponent,
    UploadTabulaComponent,
    UploadAdresesComponent,
    EndDialogComponent,
    FileDropDirective,
    DragDropDirective,
    DragableDirective,
    EditorComponent,
    PlusPipePipe,
    TotalValidatorDirective,
  ],
  imports: [
    CommonModule,
    LibraryModule,
  ],
  providers: [
  ]
})
export class UploadModule { }
