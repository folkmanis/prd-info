import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectTabulaComponent } from './select-tabula.component';
import { SelectorComponent } from './selector/selector.component';
import { LabelsComponent } from './labels/labels.component';

const routes: Routes = [
  {
    path: 'select-tabula',
    component: SelectTabulaComponent,
    children: [
      {
        path: 'selector/:apjoms',
        component: SelectorComponent,
      },
      {
        path: 'selector',
        redirectTo: 'selector/0',
      },
      {
        path: 'labels',
        component: LabelsComponent,
        data: {
          forLabels: false,
        }
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectTabulaRoutingModule { }
