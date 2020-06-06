import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';

import { XmfSearchRoutingModule } from './xmf-search-routing.module';
import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { FacetComponent } from './facet/facet.component';
import { FacetCheckerComponent } from './facet/facet-checker/facet-checker.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { ArchiveSearchService } from './services/archive-search.service';
import { StatusComponent } from './search-input/status.component';


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
    XmfSearchRoutingModule,
    LibraryModule,
  ],
})
export class XmfSearchModule { }
