import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { UploadComponent } from './upload.component';
import { UploadTabulaComponent } from './upload-tabula/upload-tabula.component';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';
import { FileDropDirective } from './file-drop.directive';
import { DragDropDirective } from './drag-drop.directive';
import { DragableDirective } from './dragable.directive';

import { EditorComponent } from './upload-tabula/editor/editor.component';
import { PlusPipePipe } from './upload-tabula/editor/plus-pipe.pipe';
import { TotalValidatorDirective } from './upload-tabula/editor/total-validator.directive';

@NgModule({
  declarations: [
    UploadComponent,
    UploadTabulaComponent,
    UploadAdresesComponent,
    FileDropDirective,
    DragDropDirective,
    DragableDirective,
    EditorComponent,
    PlusPipePipe,
    TotalValidatorDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTableModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  exports: [
  ],
  providers: [
  ]
})
export class UploadModule { }
