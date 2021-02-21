import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';

import { XmfSearchRoutingModule } from './xmf-search-routing.module';
import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { FacetComponent } from './facet/facet.component';
import { FacetCheckerComponent } from './facet/facet-checker/facet-checker.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { StatusComponent } from './search-input/status.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';


@NgModule({
  declarations: [
    XmfSearchComponent,
    SearchTableComponent,
    FacetComponent,
    FacetCheckerComponent,
    SearchInputComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    XmfSearchRoutingModule,
    LibraryModule,
  ],
})
export class XmfSearchModule { }
