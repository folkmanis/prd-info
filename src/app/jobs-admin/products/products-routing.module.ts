import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsResolverService } from './services/products-resolver.service';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: 'new',
        component: ProductsEditorComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          product: {},
        },
      },
      {
        path: ':id',
        component: ProductsEditorComponent,
        canDeactivate: [CanDeactivateGuard],
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
