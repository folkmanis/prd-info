import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { resolveProduct } from './services/product-resolver';
import { newProduct } from 'src/app/interfaces';

export default [
  {
    path: '',
    component: ProductsListComponent,
    children: [
      {
        path: 'new',
        component: ProductsEditorComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          product: newProduct,
        },
      },
      {
        path: ':id',
        component: ProductsEditorComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          product: resolveProduct,
        },
      },
    ],
  },
] as Route[];
