import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule, ParserService } from 'src/app/library';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { UploadTabulaComponent } from './upload-tabula/upload-tabula.component';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';
import { EditorComponent } from './upload-tabula/editor/editor.component';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { TotalValidatorDirective } from './upload-tabula/editor/total-validator.directive';
import { PlusPipePipe } from './upload-tabula/editor/plus-pipe.pipe';
import { UploadService, FileDropDirective, DragDropDirective, DragableDirective } from './services';
import { SelectFileComponent } from './select-file/select-file.component';
import { TotalsComponent } from './totals/totals.component';

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
    SelectFileComponent,
    TotalsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    UploadRoutingModule,
  ],
  providers: [
    UploadService,
    ParserService,
  ]
})
export class UploadModule { }
