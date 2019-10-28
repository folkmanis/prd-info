import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XmfSearchComponent } from './xmf-search.component';
import { SearchTableComponent } from './search-table/search-table.component';

const routes: Routes = [
  {
    path: '',
    component: XmfSearchComponent,
    children: [
      { path: 's', component: SearchTableComponent },
      { path: '**', redirectTo: '/xmf-search' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XmfSearchRoutingModule { }
