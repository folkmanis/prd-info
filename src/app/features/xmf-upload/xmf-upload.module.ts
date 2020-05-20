import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../../library/library.module';
import { XmfUploadRoutingModule } from './xmf-upload-routing.module';
import { XmfUploadComponent } from './xmf-upload.component';
import { TabulaComponent } from './tabula/tabula.component';

@NgModule({
  declarations: [
    XmfUploadComponent,
    TabulaComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    XmfUploadRoutingModule,
  ],
})
export class XmfUploadModule { }
