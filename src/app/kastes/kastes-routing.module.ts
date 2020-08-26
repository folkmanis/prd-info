import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { SelectorComponent } from './select-tabula/selector/selector.component';
import { LabelsComponent } from './select-tabula/labels/labels.component';
import { SelectTabulaComponent } from './select-tabula/select-tabula.component';
import { UploadComponent } from './upload/upload.component';
import { KastesComponent } from './kastes.component';

const routes: Routes = [
  {
    path: '',
    component: KastesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: KastesMainMenuComponent,
      },
      {
        path: 'selector',
        redirectTo: 'tabula/selector/0',
      },
      {
        path: 'labels',
        redirectTo: 'tabula/labels',
      },
      {
        path: 'tabula',
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
    ]
  },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class KastesRoutingModule { }
