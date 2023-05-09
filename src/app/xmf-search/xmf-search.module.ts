import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { XmfSearchRoutingModule } from './xmf-search-routing.module';
import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { FacetComponent } from './facet/facet.component';
import { FacetCheckerComponent } from './facet/facet-checker/facet-checker.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { FacetPipe } from './facet/facet-checker/facet.pipe';
import { StatusCountComponent } from './status-count/status-count.component';
import { DrawerButtonDirective } from '../library/side-button/drawer-button.directive';


@NgModule({
  declarations: [
    XmfSearchComponent,
    SearchTableComponent,
    FacetComponent,
    FacetCheckerComponent,
    SearchInputComponent,
    FacetPipe,
    StatusCountComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    XmfSearchRoutingModule,
    LibraryModule,
    DrawerButtonDirective,
  ],
})
export class XmfSearchModule { }
