import { Route } from '@angular/router';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';

export default [
  {
    path: '',
    component: KastesMainMenuComponent,
    pathMatch: 'full',
  },
  {
    path: 'selector',
    loadChildren: () => import('./selector/selector-routes'),
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload.component').then((c) => c.UploadComponent),
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/kastes-edit-route'),
  },
  { path: '**', redirectTo: '' },
] as Route[];
