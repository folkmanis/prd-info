import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleListTableComponent } from './simple-list-table.component';
import { MaterialLibraryModule } from '../material-library.module';


@NgModule({
  declarations: [
    SimpleListTableComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
  ],
  exports: [
    SimpleListTableComponent,
  ]
})
export class SimpleListTableModule { }
