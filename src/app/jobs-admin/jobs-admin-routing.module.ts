import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsAdminComponent } from './jobs-admin.component';
import { MainMenuComponent } from './main-menu/main-menu.component';


const routes: Routes = [
  {
    path: '',
    component: JobsAdminComponent,
    children: [
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers-routes'),
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products-routes'),
      },
      {
        path: 'production-stages',
        loadChildren: () => import('./production-stages/production-stages-routes'),
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment-routes'),
      },
      {
        path: 'materials',
        loadChildren: () => import('./materials/materials-routes')
      },
      {
        path: '',
        component: MainMenuComponent,
      }
    ]
  },
  {
    path: '**',
    component: JobsAdminComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsAdminRoutingModule { }
