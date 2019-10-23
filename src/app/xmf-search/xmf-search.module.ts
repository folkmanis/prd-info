import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';

import { XmfSearchRoutingModule } from './xmf-search-routing.module';
import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';


@NgModule({
  declarations: [
    XmfSearchComponent,
    SearchTableComponent
  ],
  imports: [
    CommonModule,
    XmfSearchRoutingModule,
    LibraryModule,
  ]
})
export class XmfSearchModule { }
