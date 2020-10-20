import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsResolverService } from './services/products-resolver.service';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: '',
        component: ProductsListComponent,
      },
      {
        path: 'new',
        component: EditComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          product: {},
        },
      },
      {
        path: ':id',
        component: EditComponent,
        canDeactivate: [CanDeactivateGuard],
        outlet: 'editor',
        resolve: {
          product: ProductsResolverService
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
