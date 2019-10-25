import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ScrollToTopModule } from './scroll-to-top/scroll-to-top.module';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';

@NgModule({
  declarations: [
    CopyClipboardDirective,
    TaggedStringComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatCheckboxModule,
    ScrollToTopModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatCheckboxModule,
    ScrollToTopModule,
    CopyClipboardDirective,
    TaggedStringComponent,
  ]
})
export class LibraryModule { }
