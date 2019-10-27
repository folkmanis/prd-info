import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { XmfUploadRoutingModule } from './xmf-upload-routing.module';
import { XmfUploadComponent } from './xmf-upload.component';

@NgModule({
  declarations: [
    XmfUploadComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    XmfUploadRoutingModule,
  ],
})
export class XmfUploadModule { }
