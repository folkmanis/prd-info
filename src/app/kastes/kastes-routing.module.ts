import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  {
    path: 'edit',
    loadChildren: () => import('./edit/kastes-edit-route')
  },
  { path: '**', redirectTo: '' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KastesRoutingModule { }
