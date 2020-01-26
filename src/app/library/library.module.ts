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
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule} from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { LayoutModule } from '@angular/cdk/layout';

import { ScrollToTopModule } from './scroll-to-top/scroll-to-top.module';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { FileDropDirective } from './directives/file-drop.directive';
import { AppMonthPipe } from './pipes/app-month.pipe';
import { HideZeroPipe } from './pipes/hide-zero.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    CopyClipboardDirective,
    TaggedStringComponent,
    FileDropDirective,
    AppMonthPipe,
    HideZeroPipe,
    ConfirmationDialogComponent,
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
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatSidenavModule,
    MatTreeModule,
    MatProgressBarModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    MatChipsModule,
    ScrollToTopModule,
    LayoutModule,
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
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatSidenavModule,
    MatTreeModule,
    MatProgressBarModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    MatChipsModule,
    LayoutModule,
    ScrollToTopModule,
    CopyClipboardDirective,
    TaggedStringComponent,
    FileDropDirective,
    AppMonthPipe,
    HideZeroPipe,
  ],
  entryComponents: [
    ConfirmationDialogComponent,
  ]
})
export class LibraryModule { }
