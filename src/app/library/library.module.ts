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
import { ScrollToTopModule } from './scroll-to-top/scroll-to-top.module';
import { SideButtonModule } from './side-button/side-button.module';
import { SimpleListTableModule } from './simple-list-table/simple-list-table.module';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { MaterialLibraryModule } from './material-library.module';
import { PrdCdkModule } from 'prd-cdk';
import { DateServicesModule } from './date-services';
import { InputTrimDirective } from './directives/input-trim.directive';
import { PasswordInputModule } from './password-input/password-input.module';
import { ViewSizeModule } from './view-size/view-size.module';

@NgModule({
  declarations: [
    CopyClipboardDirective,
    TaggedStringComponent,
    FileDropDirective,
    ConfirmationDialogComponent,
    CardMenuComponent,
    FocusedDirective,
    BackButtonDirective,
    InputTrimDirective,
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
    PrdCdkModule,
    DateServicesModule,
    PasswordInputModule,
    ViewSizeModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CopyClipboardDirective,
    TaggedStringComponent,
    CardMenuComponent,
    FileDropDirective,
    FocusedDirective,
    SideButtonModule,
    ScrollToTopModule,
    BackButtonDirective,
    InputTrimDirective,
    SimpleListTableModule,
    PrdCdkModule,
    DateServicesModule,
    PasswordInputModule,
    ViewSizeModule,
  ],
})
export class LibraryModule { }
