import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
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
    ]
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
  },
  {
    path: 'labels',
    redirectTo: 'select-tabula/labels',
  },
  {
    path: 'selector',
    redirectTo: 'select-tabula/selector/0',
  },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class KastesRoutingModule { }
