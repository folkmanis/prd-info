import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectorComponent } from './selector.component';

const routes: Routes = [
  {
    path: 'selector/:apjoms',
    component: SelectorComponent,
  },
  {
    path: 'selector',
    redirectTo: 'selector/0',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectorRoutingModule { }
