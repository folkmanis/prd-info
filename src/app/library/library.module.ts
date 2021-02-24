import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardMenuComponent } from './card-menu/card-menu.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { FileDropDirective } from './directives/file-drop.directive';
import { FocusedDirective } from './directives/focused.directive';
import { AppMonthPipe } from './pipes/app-month.pipe';
import { FilesizePipe } from './pipes/filesize.pipe';
import { HideZeroPipe } from './pipes/hide-zero.pipe';
import { ShortenTextPipe } from './pipes/shorten-text.pipe';
import { ScrollToTopModule } from './scroll-to-top/scroll-to-top.module';
import { SideButtonModule } from './side-button/side-button.module';
import { SimpleListTableModule } from './simple-list-table/simple-list-table.module';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { MaterialLibraryModule } from './material-library.module';

@NgModule({
  declarations: [
    CopyClipboardDirective,
    TaggedStringComponent,
    FileDropDirective,
    AppMonthPipe,
    HideZeroPipe,
    ConfirmationDialogComponent,
    CardMenuComponent,
    ShortenTextPipe,
    FocusedDirective,
    FilesizePipe,
    BackButtonDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    ScrollToTopModule,
    SideButtonModule,
    SimpleListTableModule,
    MaterialLibraryModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CopyClipboardDirective,
    TaggedStringComponent,
    CardMenuComponent,
    FileDropDirective,
    AppMonthPipe,
    HideZeroPipe,
    ShortenTextPipe,
    FocusedDirective,
    SideButtonModule,
    ScrollToTopModule,
    FilesizePipe,
    BackButtonDirective,
    SimpleListTableModule,
  ],
})
export class LibraryModule { }
