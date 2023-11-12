import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { XmfUploadRoutingModule } from './xmf-upload-routing.module';
import { XmfUploadComponent } from './xmf-upload.component';
import { TabulaComponent } from './tabula/tabula.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { FilesizePipe } from 'src/app/library/common';

@NgModule({
  declarations: [XmfUploadComponent, TabulaComponent],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    XmfUploadRoutingModule,
    FilesizePipe,
  ],
})
export class XmfUploadModule {}
