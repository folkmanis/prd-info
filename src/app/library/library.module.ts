import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ScrollToTopModule } from './scroll-to-top/scroll-to-top.module';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { FileDropDirective } from './directives/file-drop.directive';
import { AppMonthPipe } from './pipes/app-month.pipe';
import { HideZeroPipe } from './pipes/hide-zero.pipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { CardMenuComponent } from './card-menu/card-menu.component';
import { ShortenTextPipe } from './pipes/shorten-text.pipe';
import { FindSelectRouteModule } from './find-select-route/find-select-route.module';
import { FocusedDirective } from './directives/focused.directive';

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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
    MatCardModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTooltipModule,
    ScrollToTopModule,
    LayoutModule,
    ScrollingModule,
    FindSelectRouteModule,
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
    MatCardModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTooltipModule,
    LayoutModule,
    ScrollToTopModule,
    CopyClipboardDirective,
    TaggedStringComponent,
    CardMenuComponent,
    FileDropDirective,
    AppMonthPipe,
    HideZeroPipe,
    ShortenTextPipe,
    ScrollingModule,
    FindSelectRouteModule,
    FocusedDirective,
  ],
})
export class LibraryModule { }
