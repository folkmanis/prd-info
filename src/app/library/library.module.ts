import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardMenuComponent } from './card-menu/card-menu.component';
import { DateServicesModule } from './date-services';
import { DenseListDirective } from './dense-list/dense-list.directive';
import { BackButtonDirective } from './directives/back-button.directive';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { FileDropDirective } from './directives/file-drop.directive';
import { FocusedDirective } from './directives/focused.directive';
import { InputTrimDirective } from './directives/input-trim.directive';
import { InputDirective } from './directives/input.directive';
import { MaterialLibraryModule } from './material-library.module';
import { ScrollTopDirective } from './scroll-to-top/scroll-top.directive';
import { SimpleListTableModule } from './simple-list-table/simple-list-table.module';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { ViewSizeModule } from './view-size/view-size.module';

@NgModule({
  declarations: [
    CopyClipboardDirective,
    TaggedStringComponent,
    FileDropDirective,
    BackButtonDirective,
    InputTrimDirective,
    DenseListDirective,
  ],
  imports: [
    FocusedDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    SimpleListTableModule,
    MaterialLibraryModule,
    DateServicesModule,
    ViewSizeModule,
    ScrollTopDirective,
    CardMenuComponent,
    InputDirective,
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
    BackButtonDirective,
    InputTrimDirective,
    SimpleListTableModule,
    DateServicesModule,
    ViewSizeModule,
    DenseListDirective,
    InputDirective,
    ScrollTopDirective,
  ],
})
export class LibraryModule {}
