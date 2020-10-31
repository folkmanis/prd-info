import { NgModule, Type } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsResolverService } from './services/products-resolver.service';

const COMPONENT: Type<any> = ProductsEditorComponent;

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: 'new',
        component: COMPONENT,
        canDeactivate: [CanDeactivateGuard],
        data: {
          value: {},
        },
      },
      {
        path: ':id',
        component: COMPONENT,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          value: ProductsResolverService
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
