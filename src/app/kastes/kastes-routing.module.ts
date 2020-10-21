import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';

const routes: Routes = [
  {
    path: '',
    component: KastesMainMenuComponent,
    pathMatch: 'full',
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
  },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class KastesRoutingModule { }
