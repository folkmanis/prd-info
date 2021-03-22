import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { JobSelectionTableComponent } from './job-selection-table/job-selection-table.component';



@NgModule({
  declarations: [
    JobSelectionTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    RouterModule,
  ],
  exports: [
    JobSelectionTableComponent,
  ]
})
export class CalculationsLibraryModule { }
