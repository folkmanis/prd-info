import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';

const routes: Routes = [
  {
    path: '',
    component: XmfSearchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XmfSearchRoutingModule { }
